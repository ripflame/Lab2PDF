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

  function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3');
  }

  try {
    // Load and read the HTML template
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Format the date to dd/mm/yyyy
    const [year, month, day] = formData.fecha.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    // Format the age
    const formattedAge = formData.edad === '1' ? '1 año' : `${formData.edad} años`;

    // Replace placeholders with actual data
    htmlContent = htmlContent.replace('{{requerido}}', formData.requerido)
                             .replace('{{fecha}}', formattedDate)
                             .replace('{{nombreMascota}}', formData.nombreMascota)
                             .replace('{{especie}}', formData.especie)
                             .replace('{{raza}}', formData.raza)
                             .replace('{{nombrePropietario}}', formData.nombrePropietario)
                             .replace('{{edad}}', formattedAge)
                             .replace('{{sexo}}', formData.sexo)
                             .replace('{{telefono}}', formatPhoneNumber(formData.telefono))
                             .replace('{{eritrocitos}}', formatNumber(formData.eritrocitos))
                             .replace('{{hemoglobina}}', formatNumber(formData.hemoglobina))
                             .replace('{{hematocrito}}', formatNumber(formData.hematocrito))
                             .replace('{{vgm}}', formatNumber(formData.volumenGlobularMedio))
                             .replace('{{hpe}}', formatNumber(formData.hemoglobinaPromedio))
                             .replace('{{cmh}}', formatNumber(formData.concentracionMediaHemoglobina))
                             .replace('{{plaquetas}}', formatNumber(formData.plaquetas))
                             .replace('{{leucocitos}}', formatNumber(formData.leucocitos))
                             .replace('{{monocitos_rel}}', formatNumber(formData.monocitos))
                             .replace('{{linfocitos_rel}}', formatNumber(formData.linfocitos))
                             .replace('{{eosinofilos_rel}}', formatNumber(formData.eosinofilos))
                             .replace('{{basofilos_rel}}', formatNumber(formData.basofilos))
                             .replace('{{neutrofilos_segmentados_rel}}', formatNumber(formData.neutrofilosSegmentados))
                             .replace('{{neutrofilos_banda_rel}}', formatNumber(formData.neutrofilosBanda))
                             .replace('{{monocitos_abs}}', formatNumber(formData.monocitos))
                             .replace('{{linfocitos_abs}}', formatNumber(formData.linfocitos))
                             .replace('{{eosinofilos_abs}}', formatNumber(formData.eosinofilos))
                             .replace('{{basofilos_abs}}', formatNumber(formData.basofilos))
                             .replace('{{neutrofilos_segmentados_abs}}', formatNumber(formData.neutrofilosSegmentados))
                             .replace('{{neutrofilos_banda_abs}}', formatNumber(formData.neutrofilosBanda));

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
