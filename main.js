const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  mainWindow.loadFile('index.html');

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
});

ipcMain.on('generarPDF', async (event, formData) => {
  const pdfPath = path.join(app.getPath('documents'), `${formData.nombreMascota}_InformeLaboratorio.pdf`);
  const templatePath = path.join(__dirname, 'template.html');

  try {
    // Load and read the HTML template
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    htmlContent = htmlContent.replace('{{nombreMascota}}', formData.nombreMascota)
                             .replace('{{especie}}', formData.especie)
                             .replace('{{raza}}', formData.raza);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the processed HTML content
    await page.setContent(htmlContent, { waitUntil: 'load' });

    // Generate the PDF
    await page.pdf({ path: pdfPath, format: 'letter' });

    await browser.close();

    event.reply('onPDFGenerado', pdfPath);
  } catch (error) {
    console.error('Error generating PDF:', error);
    event.reply('onPDFGenerado', 'Error generating PDF');
  }
});
