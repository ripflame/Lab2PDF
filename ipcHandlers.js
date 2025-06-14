const { ipcMain, shell, app, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { generatePDF } = require("./utils/pdfGenerator");
const configLoader = require("./config/configLoader");

// Function to log errors to a file
function logErrorToFile(error) {
  const logFilePath = path.join(app.getPath("userData"), "error.log");
  const errorMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
}

function setupIpcHandlers(mainWindow) {
  ipcMain.on("generarPDF", async (event, formData, formType) => {
    try {
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
        logErrorToFile(error);
        event.reply("onPDFGenerado", "Error generating PDF: " + error.message);
      }
    } catch (error) {
      logErrorToFile(error);
      event.reply("onPDFGenerado", "Error showing save dialog: " + error.message);
    }
  });

  ipcMain.on("abrirUbicacion", (_event, ruta) => {
    try {
      shell.showItemInFolder(ruta);
    } catch (error) {
      logErrorToFile(error);
      console.error("Error opening file location: " + error.message);
    }
  });

  ipcMain.handle("getConfig", async (_event, testType, provider, species) => {
    try {
      const configTemplate = configLoader.getConfigForTestProviderAndSpecies(
        testType,
        provider,
        species,
      );
      return configTemplate;
    } catch (error) {
      console.error(
        `Error loading template for provider: ${provider}, testType: ${testType}, and species: ${species}`,
      );
      throw error;
    }
  });
  ipcMain.handle("getAllTests", async (_event) => {
    try {
      return configLoader.getAllTests();
    } catch (error) {
      console.error("Error loading all tests");
      throw error;
    }
  });
  ipcMain.handle("getProvidersByTest", async (_event, testType) => {
    try {
      return configLoader.getProvidersByTest(testType);
    } catch (error) {
      console.error(`Error loading providers for: ${testType}`);
      throw error;
    }
  });
  ipcMain.handle("getSpeciesByTestAndProvider", async (_event, testType, provider) => {
    try {
      return configLoader.getSpeciesByTestAndProvider(testType, provider);
    } catch (error) {
      console.error(`Error loading species for test type: ${testType} and provider: ${provider}`);
      throw error;
    }
  });
}

module.exports = { setupIpcHandlers };
