const { ipcMain, shell, app, dialog } = require('electron');
const path = require('path');
const { generatePDF } = require('./utils/pdfGenerator');

function setupIpcHandlers(mainWindow) {
  ipcMain.on('generarPDF', async (event, formData, formType) => {
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
      console.error('Error generating PDF:', error);
      event.reply('onPDFGenerado', 'Error generating PDF');
    }
  });

  ipcMain.on('abrirUbicacion', (event, ruta) => {
    shell.showItemInFolder(ruta);
  });
}

module.exports = { setupIpcHandlers };
