const { ipcMain, shell, app, dialog } = require("electron");
const path = require("path");
const { generatePDF } = require("./utils/pdfGenerator");
const fs = require("fs"); // Add this line to import fs module
const { app } = require("electron");

// Function to log errors
function logError(error) {
  const logPath = path.join(app.getPath("userData"), "error.log");
  const errorMessage = `${new Date().toISOString()} - ${error}\n`;
  fs.appendFileSync(logPath, errorMessage);
}

function setupIpcHandlers(mainWindow) {
  ipcMain.on("generarPDF", async (event, formData, formType) => {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: path.join(
        app.getPath("documents"),
        `${formData.nombreMascota}_InformeLaboratorio.pdf`,
      ),
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });
    if (canceled || !filePath) {
      event.reply("onPDFGenerado", null);
      return;
    }

    try {
      await generatePDF(formData, filePath, formType);
      event.reply("onPDFGenerado", filePath);
    } catch (error) {
      console.error("Error generating PDF:", error);
      logError(error); // Log the error
      event.reply("onPDFGenerado", "Error generating PDF");
    }
  });

  ipcMain.on("abrirUbicacion", (event, ruta) => {
    try {
      shell.showItemInFolder(ruta);
    } catch (error) {
      console.error("Error opening file location:", error);
      logError(error); // Log the error
    }
  });
}

module.exports = { setupIpcHandlers };
