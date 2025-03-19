const { app, BrowserWindow, dialog, Menu, globalShortcut } = require("electron");
const path = require("path");
const { setupIpcHandlers } = require("./ipcHandlers");
const { autoUpdater } = require("electron-updater");
const packageJson = require("./package.json"); // Add this line to import package.json
const fs = require("fs"); // Add this line to import fs module

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
  logErrorToFile(error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason.message || reason);
  logErrorToFile(reason);
});

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

    // Listen for update events
    autoUpdater.on("checking-for-update", () => {
      console.log("Checking for update...");
      setTaskbarProgress(-1);
    });

    autoUpdater.on("update-available", (info) => {
      console.log("Update available:", info.version);
      // Start showing indeterminate progress
      if (process.platform === "win32") {
        mainWindow.setProgressBar(2); // 2 = indeterminate progress
      } else if (process.platform === "darwin") {
        app.dock.setBadge("?"); // Show a download symbol
      }

      // Optionally notify the user through a small notification
      // (not a dialog, just a notification)
      if (Notification.isSupported()) {
        const notification = new Notification({
          title: "Actualización disponible",
          body: `Se detectó una nueva versión (${info.version}). Descargando...`,
        });
        notification.show();
      }
    });

    autoUpdater.on("update-not-available", (info) => {
      console.log("Update not available:", info.version);
    });

    autoUpdater.on("update-downloaded", (info) => {
      console.log("Update downloaded");

      // Complete the progress indicator
      setTaskbarProgress(100);

      // Show notification that update is ready
      if (Notification.isSupported()) {
        const notification = new Notification({
          title: "Actualización lista",
          body: "La actualización se descargó correctamente. Haga clic para instalar.",
          silent: false,
        });

        notification.on("click", () => {
          autoUpdater.quitAndInstall(false, true);
        });

        notification.show();
      } else {
        // If notifications aren't supported, show a dialog instead
        dialog
          .showMessageBox(mainWindow, {
            type: "info",
            title: "Actualización descargada",
            message: "La actualización se descargó correctamente. Desea instalarla ahora?",
            buttons: ["Si", "Luego"],
          })
          .then((result) => {
            if (result.response === 0) {
              // 'Si'
              autoUpdater.quitAndInstall(false, true);
            }
          });
      }

      // Reset progress after a delay
      setTimeout(() => {
        setTaskbarProgress(-1);
      }, 3000);
    });

    autoUpdater.on("download-progress", (progressObj) => {
      const progress = Math.round(progressObj.percent);
      console.log(`Download progress: ${progress}%`);

      // Update the taskbar/dock progress
      setTaskbarProgress(progress);
    });

    // Optional: log errors
    autoUpdater.on("error", (error) => {
      console.error("Auto-updater error:", error.message);
      logErrorToFile(error); // Log error to file
    });

    // Check for updates and notify
    autoUpdater.checkForUpdates();

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
              autoUpdater.checkForUpdates();
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
    logErrorToFile(error); // Log error to file
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  logErrorToFile(error); // Log error to file
});

function setTaskbarProgress(progressPercent) {
  if (!mainWindow) return;

  const progress = progressPercent / 100; // Convert percent to decimal (0-1)

  if (process.platform === "win32") {
    // Windows: Use setProgressBar with the progress value
    mainWindow.setProgressBar(progress);
  } else if (process.platform === "darwin") {
    // macOS: Set progress in dock
    app.dock.setBadge(progressPercent > 0 ? `${Math.round(progressPercent)}%` : "");
  }

  // When progress is complete or canceled, remove the progress indicator
  if (progressPercent >= 100 || progressPercent < 0) {
    if (process.platform === "win32") {
      mainWindow.setProgressBar(-1); // -1 removes the progress bar
    } else if (process.platform === "darwin") {
      app.dock.setBadge(""); // Clear the badge
    }
  }
}
