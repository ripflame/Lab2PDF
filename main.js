const { app, BrowserWindow, dialog, Menu, globalShortcut } = require('electron');
const path = require('path');
const { setupIpcHandlers } = require('./ipcHandlers');
const { autoUpdater } = require('electron-updater');
const packageJson = require('./package.json'); // Add this line to import package.json
const fs = require('fs'); // Add this line to import fs module

// Function to log errors to a file
function logErrorToFile(error) {
  const logFilePath = path.join(app.getPath('userData'), 'error.log');
  const errorMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
}

// main.js (or wherever you're using electron-reload)
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

let mainWindow;

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
  logErrorToFile(error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason.message || reason);
  logErrorToFile(reason);
});

app.whenReady().then(() => {
  try {
    globalShortcut.register("Ctrl+Shift+I", ()=> {
      if (mainWindow) {
        mainWindow.webContents.openDevTools();
      }
    })
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
      }
    });

    // Listen for update events
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version);
      dialog.showMessageBox({
        type: 'info',
        title: 'Actualización disponible',
        message: 'Se detectó una nueva versión. Descargando...',
        buttons: ['Aceptar']
      });
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available:', info.version);
    });

    autoUpdater.on('update-downloaded', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Actualización descargada',
        message: 'La actualización se descargó correctamente. ¿Desea instalarla ahora?',
        buttons: ['Si', 'Luego']
      }).then((result) => {
        if (result.response === 0) { // 'Si'
          autoUpdater.quitAndInstall();
        }
      });
    });

    // Optional: log errors
    autoUpdater.on('error', (error) => {
      console.error('Auto-updater error:', error.message);
      logErrorToFile(error); // Log error to file
    });

    // Check for updates and notify
    autoUpdater.checkForUpdates();

    const menu = Menu.buildFromTemplate([
      {
        label: 'Archivo',
        submenu: [
          { role: 'quit' }
        ]
      },
      {
        label: 'Ayuda',
        submenu: [
          {
            label: 'Acerca de',
            click: () => {
              dialog.showMessageBox({
                type: 'info',
                title: 'Acerca de',
                message: `Lab2PDF\nVersion ${packageJson.version}\nDesarrollada por Ripflame`, // Use dynamic version
                buttons: ['OK']
              });
            }
          },
          {
            label: 'Actualizar',
            click: () => {
              autoUpdater.checkForUpdates();
            }
          }
        ]
      }
    ]);

    Menu.setApplicationMenu(menu);

    mainWindow.loadFile('index.html');

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
    });

    setupIpcHandlers(mainWindow);
  } catch (error) {
    console.error('Error during app initialization:', error.message);
    logErrorToFile(error); // Log error to file
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
  logErrorToFile(error); // Log error to file
});
