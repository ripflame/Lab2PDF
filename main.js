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
  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info.version);
    // If you want to show a notification or something minimal, you can do it here.
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info.version);
    // For minimal interaction, just install immediately:
    // autoUpdater.quitAndInstall();

    // Or prompt the user:
    const { dialog } = require('electron');
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'A new version is downloaded. Restart now?',
      buttons: ['Yes', 'Later']
    }).then((result) => {
      if (result.response === 0) { // 'Yes'
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Optional: log errors
  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error);
  });

  autoUpdater.checkForUpdates();
  mainWindow.loadFile('index.html');

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  setupIpcHandlers(mainWindow);
});
