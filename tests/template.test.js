const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

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

    const topGraphic = await page.$('.top-graphic');
    const bottomGraphic = await page.$('.bottom-graphic');

    assert.ok(topGraphic, 'Top graphic should be present');
    assert.ok(bottomGraphic, 'Bottom graphic should be present');
  });
});

describe('PDF Generation', function() {
  this.timeout(10000); // Increase timeout for PDF generation

  it('should generate a PDF file', async function() {
    const formData = {
      nombreMascota: 'Fido',
      especie: 'Perro',
      raza: 'Labrador'
    };

    const outputDir = path.join(__dirname, 'test_output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const pdfPath = path.join(outputDir, `${formData.nombreMascota}_InformeLaboratorio.pdf`);
    const templatePath = path.join(__dirname, '..', 'templates', 'template.html');
    const topImagePath = path.join(__dirname, '../templates/img/top.svg');
    const bottomImagePath = path.join(__dirname, '../templates/img/bottom.svg');

    const topImageContent = fs.readFileSync(topImagePath, 'utf8');
    const bottomImageContent = fs.readFileSync(bottomImagePath, 'utf8');

    // Load and read the HTML template
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    htmlContent = htmlContent.replace('{{nombreMascota}}', formData.nombreMascota)
                             .replace('{{especie}}', formData.especie)
                             .replace('{{raza}}', formData.raza);

    // Embed SVG images directly into the HTML
    htmlContent = htmlContent.replace('{{topImagePath}}', `data:image/svg+xml;base64,${Buffer.from(topImageContent).toString('base64')}`)
                             .replace('{{bottomImagePath}}', `data:image/svg+xml;base64,${Buffer.from(bottomImageContent).toString('base64')}`);

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

    // Add a delay before generating the PDF
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate the PDF
    await page.pdf({ path: pdfPath, format: 'letter' });

    await browser.close();

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), 'PDF file was not created');
  });
});
