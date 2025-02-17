const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');

// Add electron-reload
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

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
  const templatePath = path.join(__dirname, 'templates', 'template.html');
  const topImagePath = path.join(__dirname, 'templates', 'img', 'top.svg');
  const bottomImagePath = path.join(__dirname, 'templates', 'img', 'bottom.svg');

  const topImageContent = fs.readFileSync(topImagePath, 'utf8');
  const bottomImageContent = fs.readFileSync(bottomImagePath, 'utf8');

  try {
    // Load and read the HTML template
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    htmlContent = htmlContent.replace('{{nombreMascota}}', formData.nombreMascota)
                             .replace('{{especie}}', formData.especie)
                             .replace('{{raza}}', formData.raza);

    // Embed SVG images directly into the HTML
    htmlContent = htmlContent.replace('./img/top.svg', `data:image/svg+xml;base64,${Buffer.from(topImageContent).toString('base64')}`)
                 .replace('./img/bottom.svg', `data:image/svg+xml;base64,${Buffer.from(bottomImageContent).toString('base64')}`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the processed HTML content
    await page.setContent(htmlContent, { waitUntil: 'load' });

    // Ensure images are fully loaded
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(images.map(img => {
        if (img.complete) return;
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }));
    });

    // Generate the PDF
    await page.pdf({ path: pdfPath, format: 'letter' });

    await browser.close();

    event.reply('onPDFGenerado', pdfPath);
  } catch (error) {
    console.error('Error generating PDF:', error);
    event.reply('onPDFGenerado', 'Error generating PDF');
  }
});
