const { ipcMain, shell, app } = require('electron');
const path = require('path');
const { generatePDF } = require('./utils/pdfGenerator');

function setupIpcHandlers(mainWindow) {
  ipcMain.on('generarPDF', async (event, formData, formType) => {
    const pdfPath = path.join(app.getPath('documents'), `${formData.nombreMascota}_InformeLaboratorio.pdf`);

    try {
      await generatePDF(formData, pdfPath, formType);
      event.reply('onPDFGenerado', pdfPath);
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
