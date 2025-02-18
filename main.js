const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { generatePDF } = require('./utils/pdfGenerator');

// Add electron-reload
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

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

ipcMain.on('generarPDF', async (event, formData) => {
  const pdfPath = path.join(app.getPath('documents'), `${formData.nombreMascota}_InformeLaboratorio.pdf`);

  try {
    await generatePDF(formData, pdfPath);
    event.reply('onPDFGenerado', pdfPath);
  } catch (error) {
    console.error('Error generating PDF:', error);
    event.reply('onPDFGenerado', 'Error generating PDF');
  }
});
