const { app, BrowserWindow, dialog, Menu, globalShortcut, Notification } = require("electron");
const path = require("path");
const { setupIpcHandlers } = require("./ipcHandlers");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log"); // Add logging
const packageJson = require("./package.json");
const fs = require("fs");

// Configure logging for auto-updater
log.transports.file.level = "debug";
autoUpdater.logger = log;
console.log(`Log file location: ${log.transports.file.getFile()}`);
console.log(`Current version: ${packageJson.version}`);
log.info(`Current version: ${packageJson.version}`);

// Function to log errors to a file
function logErrorToFile(error) {
  const logFilePath = path.join(app.getPath("userData"), "error.log");
  const errorMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
}

// main.js (or wherever you're using electron-reload)
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

let mainWindow;

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  log.error("Uncaught exception:", error);
  logErrorToFile(error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason.message || reason);
  log.error("Unhandled rejection:", reason);
  logErrorToFile(reason);
});

function setTaskbarProgress(progressPercent) {
  if (!mainWindow) return;

  if (progressPercent < 0) {
    // Remove progress indicator
    if (process.platform === "win32") {
      mainWindow.setProgressBar(-1);
    } else if (process.platform === "darwin") {
      app.dock.setBadge("");
    }
    return;
  }

  const progress = progressPercent / 100; // Convert percent to decimal
  if (process.platform === "win32") {
    mainWindow.setProgressBar(progress);
  } else if (process.platform === "darwin") {
    app.dock.setBadge(progressPercent > 0 ? `${Math.round(progressPercent)}%` : "");
  }
}

app.whenReady().then(() => {
  try {
    globalShortcut.register("Ctrl+Shift+I", () => {
      if (mainWindow) {
        mainWindow.webContents.openDevTools();
      }
    });

    mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,
      },
    });

    // Configure auto-updater
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    // Listen for update events
    autoUpdater.on("checking-for-update", () => {
      console.log("Checking for update...");
      log.info("Checking for update...");
    });

    autoUpdater.on("update-available", (info) => {
      console.log("Update available:", info.version);
      log.info("Update available:", info.version);

      // Show dialog for update available
      dialog.showMessageBox({
        type: "info",
        title: "Actualización disponible",
        message: `Se detectó una nueva versión (${info.version}). Descargando...`,
        buttons: ["Aceptar"],
      });

      // Also show progress in taskbar if supported
      if (process.platform === "win32") {
        mainWindow.setProgressBar(2); // 2 = indeterminate progress
      } else if (process.platform === "darwin") {
        app.dock.setBadge("?"); // Show a download symbol
      }
    });

    autoUpdater.on("update-not-available", (info) => {
      console.log("Update not available:", info.version);
      log.info("Update not available:", info.version);
    });

    autoUpdater.on("download-progress", (progressObj) => {
      const progress = Math.round(progressObj.percent);
      console.log(`Download progress: ${progress}%`);
      log.info(`Download progress: ${progress}%`);
      setTaskbarProgress(progress);
    });

    autoUpdater.on("update-downloaded", (info) => {
      console.log("Update downloaded");
      log.info("Update downloaded");

      // Complete the progress indicator
      setTaskbarProgress(100);

      // Show dialog for update downloaded
      dialog
        .showMessageBox({
          type: "info",
          title: "Actualización descargada",
          message: "La actualización se descargó correctamente. ¿Desea instalarla ahora?",
          buttons: ["Si", "Luego"],
        })
        .then((result) => {
          if (result.response === 0) {
            // 'Si'
            autoUpdater.quitAndInstall(false, true);
          }
        });

      // Reset progress after a delay
      setTimeout(() => {
        setTaskbarProgress(-1);
      }, 3000);
    });

    // Optional: log errors
    autoUpdater.on("error", (error) => {
      console.error("Auto-updater error:", error.message);
      log.error("Auto-updater error:", error);
      logErrorToFile(error); // Log error to file
    });

    // Check for updates with better error handling
    try {
      console.log("Initializing auto-updater...");
      log.info("Initializing auto-updater...");

      // Only run in packaged app
      if (app.isPackaged) {
        console.log("App is packaged, checking for updates...");
        log.info("App is packaged, checking for updates...");

        autoUpdater.checkForUpdates().catch((err) => {
          console.error("Error checking for updates:", err);
          log.error("Error checking for updates:", err);
          logErrorToFile(err);
        });
      } else {
        console.log("App is in development mode, skipping update check");
        log.info("App is in development mode, skipping update check");
      }
    } catch (error) {
      console.error("Failed to initialize auto-updater:", error);
      log.error("Failed to initialize auto-updater:", error);
      logErrorToFile(error);
    }

    const menu = Menu.buildFromTemplate([
      {
        label: "Archivo",
        submenu: [{ role: "quit" }],
      },
      {
        label: "Ayuda",
        submenu: [
          {
            label: "Acerca de",
            click: () => {
              dialog.showMessageBox({
                type: "info",
                title: "Acerca de",
                message: `Lab2PDF\nVersion ${packageJson.version}\nDesarrollada por Ripflame`, // Use dynamic version
                buttons: ["OK"],
              });
            },
          },
          {
            label: "Actualizar",
            click: () => {
              if (app.isPackaged) {
                console.log("Manual update check triggered");
                log.info("Manual update check triggered");
                autoUpdater.checkForUpdates().catch((err) => {
                  console.error("Error in manual update check:", err);
                  log.error("Error in manual update check:", err);
                  logErrorToFile(err);
                });
              } else {
                dialog.showMessageBox({
                  type: "info",
                  title: "Modo desarrollo",
                  message: "Las actualizaciones no están disponibles en modo desarrollo.",
                  buttons: ["OK"],
                });
              }
            },
          },
        ],
      },
    ]);

    Menu.setApplicationMenu(menu);

    mainWindow.loadFile("index.html");

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") app.quit();
    });

    setupIpcHandlers(mainWindow);
  } catch (error) {
    console.error("Error during app initialization:", error.message);
    log.error("Error during app initialization:", error);
    logErrorToFile(error); // Log error to file
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// This is redundant with the process.on('uncaughtException') handler above,
// but keeping it for completeness
app.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  log.error("Uncaught exception:", error);
  logErrorToFile(error); // Log error to file
});
