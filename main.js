const { app, BrowserWindow } = require('electron');
const path = require('path');
const { setupIpcHandlers } = require('./ipcHandlers');
const { autoUpdater } = require('electron-updater');

// main.js (or wherever you're using electron-reload)
if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
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
    const { dialog } = require('electron');
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
    console.error('Auto-updater error:', error);
  });

  // Check for updates and notify
  autoUpdater.checkForUpdates();

  mainWindow.loadFile('index.html');

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  setupIpcHandlers(mainWindow);
});
