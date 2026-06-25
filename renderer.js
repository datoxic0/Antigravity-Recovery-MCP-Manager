let currentConfig = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();

  document.getElementById('btn-refresh').addEventListener('click', loadConfig);
  document.getElementById('btn-safe-boot').addEventListener('click', handleSafeBoot);
});

async function loadConfig() {
  try {
    currentConfig = await window.api.readConfig();
    renderMcpList();
  } catch (error) {
    showToast('Failed to load config', true);
  }
}

function renderMcpList() {
  const listEl = document.getElementById('mcp-list');
  const emptyState = document.getElementById('mcp-empty-state');
  listEl.innerHTML = '';

  const activeServers = currentConfig.mcpServers || {};
  const disabledServers = currentConfig.disabledMcpServers || {};
  
  const allServerNames = [...Object.keys(activeServers), ...Object.keys(disabledServers)];

  if (allServerNames.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  let delay = 0;
  for (const name of allServerNames) {
    const isActive = activeServers.hasOwnProperty(name);
    const serverConfig = isActive ? activeServers[name] : disabledServers[name];
    
    const itemEl = document.createElement('div');
    itemEl.className = 'mcp-item';
    itemEl.style.animationDelay = `${delay}ms`;
    delay += 50; // stagger animation
    
    // Command preview
    const cmdPreview = serverConfig.command ? `${serverConfig.command} ${serverConfig.args ? serverConfig.args.join(' ') : ''}` : 'Unknown Command';

    itemEl.innerHTML = `
      <div class="mcp-item-info">
        <strong>${name}</strong>
        <span>${cmdPreview}</span>
      </div>
      <label class="switch">
        <input type="checkbox" data-name="${name}" ${isActive ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    `;

    listEl.appendChild(itemEl);
  }

  // Attach toggle listeners
  const toggles = listEl.querySelectorAll('input[type="checkbox"]');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => handleToggleMcp(e.target.dataset.name, e.target.checked));
  });
}

async function handleToggleMcp(name, isEnabled) {
  if (!currentConfig.mcpServers) currentConfig.mcpServers = {};
  if (!currentConfig.disabledMcpServers) currentConfig.disabledMcpServers = {};

  if (isEnabled) {
    // Move from disabled to active
    if (currentConfig.disabledMcpServers[name]) {
      currentConfig.mcpServers[name] = currentConfig.disabledMcpServers[name];
      delete currentConfig.disabledMcpServers[name];
    }
  } else {
    // Move from active to disabled
    if (currentConfig.mcpServers[name]) {
      currentConfig.disabledMcpServers[name] = currentConfig.mcpServers[name];
      delete currentConfig.mcpServers[name];
    }
  }

  try {
    await window.api.writeConfig(currentConfig);
    showToast(`Server '${name}' ${isEnabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    showToast('Failed to save config changes', true);
    // Revert UI on failure
    await loadConfig();
  }
}

async function handleSafeBoot() {
  const btn = document.getElementById('btn-safe-boot');
  btn.disabled = true;
  btn.innerHTML = '🔄 Rebooting...';
  
  try {
    const result = await window.api.safeBoot();
    if (result.success) {
      showToast('Panic Reboot Successful! Antigravity launched.');
      await loadConfig(); // refresh UI
    } else {
      showToast(`Reboot failed: ${result.error}`, true);
    }
  } catch (error) {
    showToast('An error occurred during Safe Boot', true);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">⚡</span> Panic Reboot';
  }
}

function showToast(message, isError = false) {
  const toast = document.getElementById('notification-toast');
  const msgEl = document.getElementById('toast-message');
  
  toast.style.background = isError ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)';
  msgEl.textContent = message;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
