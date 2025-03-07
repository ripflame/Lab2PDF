const { contextBridge, ipcRenderer } = require('electron');

// Expose functions to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Function to generate PDF
  generarPDF: (formData, formType) => ipcRenderer.send('generarPDF', formData, formType),

  // Function to handle PDF generation event
  onPDFGenerado: (callback) => ipcRenderer.on('onPDFGenerado', callback),

  // Function to open file location
  abrirUbicacion: (ruta) => ipcRenderer.send('abrirUbicacion', ruta),
});
