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
      relativos: {
        monocitos: '0',
        linfocitos: '44',
        eosinofilos: '18',
        basofilos: '0',
        neutrofilosSegmentados: '38',
        neutrofilosBanda: '0'
      },
      absolutos: {
        monocitos: '0',
        linfocitos: '6336',
        eosinofilos: '2592',
        basofilos: '0',
        neutrofilosSegmentados: '5472',
        neutrofilosBanda: '0'
      }
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

    // Format the date to dd/mm/yyyy
    const [year, month, day] = formData.fecha.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    // Format the age
    const formattedAge = formData.edad === '1' ? '1 año' : `${formData.edad} años`;

    function formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatPhoneNumber(phoneNumber) {
      const formatted = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3');
      return formatted;
    }

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
                             .replace('{{monocitos_rel}}', formatNumber(formData.relativos.monocitos))
                             .replace('{{linfocitos_rel}}', formatNumber(formData.relativos.linfocitos))
                             .replace('{{eosinofilos_rel}}', formatNumber(formData.relativos.eosinofilos))
                             .replace('{{basofilos_rel}}', formatNumber(formData.relativos.basofilos))
                             .replace('{{neutrofilos_segmentados_rel}}', formatNumber(formData.relativos.neutrofilosSegmentados))
                             .replace('{{neutrofilos_banda_rel}}', formatNumber(formData.relativos.neutrofilosBanda))
                             .replace('{{monocitos_abs}}', formatNumber(formData.absolutos.monocitos))
                             .replace('{{linfocitos_abs}}', formatNumber(formData.absolutos.linfocitos))
                             .replace('{{eosinofilos_abs}}', formatNumber(formData.absolutos.eosinofilos))
                             .replace('{{basofilos_abs}}', formatNumber(formData.absolutos.basofilos))
                             .replace('{{neutrofilos_segmentados_abs}}', formatNumber(formData.absolutos.neutrofilosSegmentados))
                             .replace('{{neutrofilos_banda_abs}}', formatNumber(formData.absolutos.neutrofilosBanda));

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

    // Add a delay before generating the PDF
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate the PDF
    await page.pdf({ 
      path: pdfPath, 
      format: 'letter',
      printBackground: true,
      margin: {
        top: '0in',
        right: '0in',
        bottom: '0in',
        left: '0in'
      }
    });

    await browser.close();

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), 'PDF file was not created');
  });
});
