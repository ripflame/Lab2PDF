const { contextBridge, ipcRenderer } = require("electron");

// Expose functions to the renderer process
contextBridge.exposeInMainWorld("electron", {
  // Function to generate PDF
  generarPDF: (formData, formType) => ipcRenderer.send("generarPDF", formData, formType),

  // Function to open file location
  abrirUbicacion: (ruta) => ipcRenderer.send("abrirUbicacion", ruta),

  //Function that returns a config file
  getConfig: (testType, provider, species) =>
    ipcRenderer.invoke("getConfig", testType, provider, species),
  getAllTests: () => ipcRenderer.invoke("getAllTests"),
  getProvidersByTest: (testType) => ipcRenderer.invoke("getProvidersByTest", testType),
  // Function to handle PDF generation event
  onPDFGenerado: (callback) =>
    ipcRenderer.on("onPDFGenerado", (_event, ...args) => callback(...args)),
});
