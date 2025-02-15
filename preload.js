const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  generarPDF: (data) => ipcRenderer.send('generarPDF', data),
  onPDFGenerado: (callback) => ipcRenderer.on('onPDFGenerado', callback),
});