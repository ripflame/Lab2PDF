const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { generatePDF } = require('../utils/pdfGenerator');

describe('Template HTML Generation', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it('should generate the template correctly', async () => {
    const templatePath = path.join(__dirname, '../templates/template.html');
    const topImagePath = path.join(__dirname, '../templates/img/top.svg');
    const bottomImagePath = path.join(__dirname, '../templates/img/bottom.svg');

    const topImageContent = fs.readFileSync(topImagePath, 'utf8');
    const bottomImageContent = fs.readFileSync(bottomImagePath, 'utf8');

    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    htmlContent = htmlContent.replace('{{topImagePath}}', `data:image/svg+xml;base64,${Buffer.from(topImageContent).toString('base64')}`)
                             .replace('{{bottomImagePath}}', `data:image/svg+xml;base64,${Buffer.from(bottomImageContent).toString('base64')}`);

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

    const topGraphic = await page.$('.graphic-top');
    const bottomGraphic = await page.$('.graphic-bottom');

    assert.ok(topGraphic, 'Top graphic should be present');
    assert.ok(bottomGraphic, 'Bottom graphic should be present');
  });
});

describe('PDF Generation', function() {
  this.timeout(10000); // Increase timeout for PDF generation

  it('should generate a PDF file', async function() {
    const formData = {
      requerido: 'Veterinaria CaNinna',
      nombrePropietario: 'Juan Pérez',
      telefono: '1234567890',
      nombreMascota: 'Fido',
      especie: 'Perro',
      raza: 'Labrador',
      edad: '5',
      sexo: 'macho',
      fecha: '2023-10-01',
      eritrocitos: '7240000',
      hemoglobina: '17.8',
      hematocrito: '54.5',
      volumenGlobularMedio: '75.2',
      hemoglobinaPromedio: '24.6',
      concentracionMediaHemoglobina: '32.7',
      plaquetas: '339000',
      leucocitos: '14400',
      monocitos_rel: '0',
      linfocitos_rel: '44',
      eosinofilos_rel: '18',
      basofilos_rel: '0',
      neutrofilos_segmentados_rel: '38',
      neutrofilos_banda_rel: '0',
      monocitos_abs: '0',
      linfocitos_abs: '6336',
      eosinofilos_abs: '2592',
      basofilos_abs: '0',
      neutrofilos_segmentados_abs: '5472',
      neutrofilos_banda_abs: '0'
    };

    const outputDir = path.join(__dirname, 'test_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const pdfPath = path.join(outputDir, `${formData.nombreMascota}_InformeLaboratorio.pdf`);

    await generatePDF(formData, pdfPath);

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), 'PDF file was not created');
  });
});
