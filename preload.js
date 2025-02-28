const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  generarPDF: (formData, formType) => ipcRenderer.send('generarPDF', formData, formType),
  onPDFGenerado: (callback) => ipcRenderer.on('onPDFGenerado', callback),
  abrirUbicacion: (ruta) => ipcRenderer.send('abrirUbicacion', ruta),
});