const { ipcMain, shell, app, dialog } = require('electron');
const path = require('path');
const { generatePDF } = require('./utils/pdfGenerator');
const fs = require('fs');

// Function to log errors to a file
function logErrorToFile(error) {
  const logFilePath = path.join(app.getPath('userData'), 'error.log');
  const errorMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
}

function setupIpcHandlers(mainWindow) {
  ipcMain.on('generarPDF', async (event, formData, formType) => {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
        defaultPath: path.join(app.getPath('documents'), `${formData.nombreMascota}_InformeLaboratorio.pdf`),
        filters: [{ name: 'PDF', extensions: ['pdf'] }],
      });
      if (canceled || !filePath) {
        event.reply('onPDFGenerado', null);
        return;
      }

      try {
        await generatePDF(formData, filePath, formType);
        event.reply('onPDFGenerado', filePath);
      } catch (error) {
        logErrorToFile(error);
        event.reply('onPDFGenerado', 'Error generating PDF: ' + error.message);
      }
    } catch (error) {
      logErrorToFile(error);
      event.reply('onPDFGenerado', 'Error showing save dialog: ' + error.message);
    }
  });

  ipcMain.on('abrirUbicacion', (event, ruta) => {
    try {
      shell.showItemInFolder(ruta);
    } catch (error) {
      logErrorToFile(error);
      console.error('Error opening file location: ' + error.message);
    }
  });
}

module.exports = { setupIpcHandlers };
