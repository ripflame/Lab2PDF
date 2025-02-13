const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  generatePDF: (data) => ipcRenderer.send('generate-pdf', data),
  onPDFGenerated: (callback) => ipcRenderer.on('pdf-generated', callback),
});