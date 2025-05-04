const { contextBridge, ipcRenderer } = require("electron");

// Expose functions to the renderer process
contextBridge.exposeInMainWorld("electron", {
  // Function to generate PDF
  generarPDF: (formData, formType) => ipcRenderer.send("generarPDF", formData, formType),

  // Function to open file location
  abrirUbicacion: (ruta) => ipcRenderer.send("abrirUbicacion", ruta),

  //Function that returns a config file
  getConfig: (provider, testType, species) =>
    ipcRenderer.invoke("getConfig", provider, testType, species),
  getProviders: () => ipcRenderer.invoke("getProviders"),
  getTestsForProvider: (provider) => ipcRenderer.invoke("getTestsForProvider", provider),

  // Function to handle PDF generation event
  onPDFGenerado: (callback) =>
    ipcRenderer.on("onPDFGenerado", (_event, ...args) => callback(...args)),
});
