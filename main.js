const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const USER_PROFILE = process.env.USERPROFILE || process.env.HOME;
const CONFIG_PATH = path.join(USER_PROFILE, '.gemini', 'config', 'mcp_config.json');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a'
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers

ipcMain.handle('read-config', async () => {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return { mcpServers: {}, disabledMcpServers: {} };
    }
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config:', error);
    throw error;
  }
});

ipcMain.handle('write-config', async (event, config) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('Error writing config:', error);
    throw error;
  }
});

ipcMain.handle('safe-boot', async () => {
  try {
    // 1. Back up config
    if (fs.existsSync(CONFIG_PATH)) {
      const backupPath = path.join(USER_PROFILE, '.gemini', 'config', `mcp_config_backup_${Date.now()}.json`);
      fs.copyFileSync(CONFIG_PATH, backupPath);
    }

    // 2. Reset config
    const resetConfig = { mcpServers: {} };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(resetConfig, null, 2), 'utf-8');

    // 3. Kill existing processes
    const killCmd = `powershell -Command "Stop-Process -Name 'antigravity-ide' -ErrorAction SilentlyContinue; Stop-Process -Name 'antigravity' -ErrorAction SilentlyContinue"`;
    
    return new Promise((resolve, reject) => {
      exec(killCmd, (error) => {
        // Ignoring kill errors since processes might not exist
        
        // 4. Launch Antigravity
        const launchCmd = `powershell -Command "& 'C:\\Users\\Asikhule Safetify\\AppData\\Local\\Programs\\Antigravity IDE\\bin\\antigravity-ide.cmd'"`;
        exec(launchCmd, (launchError) => {
           if (launchError) {
             console.error('Failed to launch:', launchError);
             resolve({ success: false, error: launchError.message });
           } else {
             resolve({ success: true });
           }
        });
      });
    });

  } catch (error) {
    console.error('Safe boot error:', error);
    throw error;
  }
});
