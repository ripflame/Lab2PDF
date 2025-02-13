const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });
  
  mainWindow.loadFile('index.html');

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
});

ipcMain.on('generate-pdf', (event, formData) => {
  console.log('Received form data:', formData);
  // PDF generation logic will go here.
  event.reply('pdf-generated', 'Path/to/generated/report.pdf');  // Placeholder
});