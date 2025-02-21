const { app, BrowserWindow, ipcMain, shell } = require('electron');
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

  mainWindow.loadFile('index.html');

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
});

ipcMain.on('generarPDF', async (event, formData) => {
  console.log('Datos recibidos para generar PDF:', formData); // Debugging line
  const pdfPath = path.join(app.getPath('documents'), `${formData.nombreMascota}_InformeLaboratorio.pdf`);

  try {
    await generatePDF(formData, pdfPath);
    console.log('PDF generado en:', pdfPath); // Debugging line
    event.reply('onPDFGenerado', pdfPath);
  } catch (error) {
    console.error('Error generating PDF:', error);
    event.reply('onPDFGenerado', 'Error generating PDF');
  }
});

ipcMain.on('abrirUbicacion', (event, ruta) => {
  shell.showItemInFolder(ruta);
});
