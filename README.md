# Antigravity Recovery and MCP Manager

![Electron](https://img.shields.io/badge/Electron-42.5.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-22.12.0-green)
![License](https://img.shields.io/badge/License-ISC-brightgreen)

This application provides a user-friendly interface for managing Antigravity and Recovery of MCP servers and offers a "Panic Reboot" feature for troubleshooting IDE startup issues.

## Features

*   **MCP Server Management:**
    *   View a list of configured MCP servers.
    *   Enable or disable MCP servers with a simple toggle.
    *   Display the command and arguments for each MCP server.
*   **Safe Mode Boot:**
    *   Reset MCP configurations to a clean state.
    *   Launch the Antigravity IDE in a safe mode if it's stuck on "Working...".
    *   Automatically creates a backup of the existing MCP configuration before resetting.
*   **Notifications:**
    *   Provides visual feedback for actions like loading config, saving changes, and successful/failed reboots.
*   **Modern UI:**
    *   Clean and professional interface with a glassmorphism aesthetic.
    *   Smooth animations for a polished user experience.

## Setup Instructions

### Prerequisites

*   **Node.js:** Ensure you have Node.js installed (version 22.12.0 or higher recommended). You can download it from [nodejs.org](https://nodejs.org/).
*   **Electron:** The application is built using Electron.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/datoxic0/Antigravity-Recovery-MCP-Manager.git
    cd Antigravity-Recovery-MCP-Manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the application:**
    ```bash
    npm start
    ```

This command will launch the Antigravity Recovery MCP Manager application.

## Technology Stack

*   **Core Framework:** [Electron](https://www.electronjs.org/) - For building cross-platform desktop applications with web technologies.
*   **Language:** JavaScript (Node.js)
*   **Frontend:** HTML, CSS, JavaScript
*   **Styling:** Custom CSS with Glassmorphism effects and Google Fonts (`Outfit`).
*   **Process Management:** `child_process` (Node.js `exec`) for executing shell commands.
*   **File System Operations:** `fs` (Node.js) for reading and writing configuration files.

## Repository Structure

```
.
├── README.md
├── icon.png
├── index.html
├── main.js
├── package-lock.json
├── package.json
├── preload.js
├── renderer.js
└── styles.css
```

*   `main.js`: The main process script for Electron, handling window creation, IPC, and core logic.
*   `preload.js`: Preload script to securely expose Node.js APIs to the renderer process.
*   `renderer.js`: The renderer process script, handling UI interactions and communication with the main process.
*   `index.html`: The main HTML file for the application's user interface.
*   `styles.css`: Stylesheet for the application's appearance.
*   `package.json`: Project metadata and dependencies.
*   `package-lock.json`: Locks dependency versions.
*   `icon.png`: Application icon.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.