const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Utility functions
function formatNumber(number) {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
}

function formatPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3');
}

async function compressBase64Image(base64String, quality = 70) {
  // Extract Base64 data (removing metadata prefix)
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  // Use sharp to get metadata (detects format automatically)
  const metadata = await sharp(imageBuffer).metadata();

  // Convert to the detected format
  let processedImage = sharp(imageBuffer).resize({ width: 350 });

  switch (metadata.format) {
      case 'jpeg':
          processedImage = processedImage.jpeg({ quality });
          break;
      case 'png':
          processedImage = processedImage.png({ compressionLevel: 9 });
          break;
      case 'webp':
          processedImage = processedImage.webp({ quality });
          break;
      default:
          throw new Error(`Unsupported image format: ${metadata.format}`);
  }

  // Convert processed image to Base64
  const compressedBuffer = await processedImage.toBuffer();
  const compressedBase64 = `data:image/${metadata.format};base64,${compressedBuffer.toString("base64")}`;

  return compressedBase64;
}

// Main function to generate PDF
async function generatePDF(formData, outputPath, formType) {
  const templatePath = path.join(__dirname, '../templates', `${formType}Template.html`);
  const topImagePath = path.join(__dirname, '../templates/img/top.svg');
  const bottomImagePath = path.join(__dirname, '../templates/img/bottom.svg');
  const compressedImagePath = path.join(os.tmpdir(), `compressed-${Date.now()}.jpg`);

  const topImageContent = fs.readFileSync(topImagePath, 'utf8');
  const bottomImageContent = fs.readFileSync(bottomImagePath, 'utf8');

  let htmlContent = fs.readFileSync(templatePath, 'utf8');

  const [year, month, day] = formData.fecha.split('-');
  const formattedDate = `${day}/${month}/${year}`;
  const formattedAge = formData.edad === '1' ? '1 año' : `${formData.edad} años`;

  htmlContent = htmlContent.replace('{{requerido}}', formData.requerido)
                           .replace('{{fecha}}', formattedDate)
                           .replace('{{nombreMascota}}', formData.nombreMascota)
                           .replace('{{especie}}', formData.especie)
                           .replace('{{raza}}', formData.raza)
                           .replace('{{nombrePropietario}}', formData.nombrePropietario)
                           .replace('{{edad}}', formattedAge)
                           .replace('{{sexo}}', formData.sexo)
                           .replace('{{telefono}}', formatPhoneNumber(formData.telefono));

  if (formType === 'hemogram') {
    htmlContent = htmlContent.replace('{{eritrocitos}}', formatNumber(formData.eritrocitos))
                             .replace('{{hemoglobina}}', formatNumber(formData.hemoglobina))
                             .replace('{{hematocrito}}', formatNumber(formData.hematocrito))
                             .replace('{{vgm}}', formatNumber(formData.volumenGlobularMedio))
                             .replace('{{hpe}}', formatNumber(formData.hemoglobinaPromedio))
                             .replace('{{cmh}}', formatNumber(formData.concentracionMediaHemoglobina))
                             .replace('{{plaquetas}}', formatNumber(formData.plaquetas))
                             .replace('{{leucocitos}}', formatNumber(formData.leucocitos))
                             .replace('{{monocitos_rel}}', formatNumber(formData.monocitos_rel))
                             .replace('{{linfocitos_rel}}', formatNumber(formData.linfocitos_rel))
                             .replace('{{eosinofilos_rel}}', formatNumber(formData.eosinofilos_rel))
                             .replace('{{basofilos_rel}}', formatNumber(formData.basofilos_rel))
                             .replace('{{neutrofilos_segmentados_rel}}', formatNumber(formData.neutrofilos_segmentados_rel))
                             .replace('{{neutrofilos_banda_rel}}', formatNumber(formData.neutrofilos_banda_rel))
                             .replace('{{monocitos_abs}}', formatNumber(formData.monocitos_abs))
                             .replace('{{linfocitos_abs}}', formatNumber(formData.linfocitos_abs))
                             .replace('{{eosinofilos_abs}}', formatNumber(formData.eosinofilos_abs))
                             .replace('{{basofilos_abs}}', formatNumber(formData.basofilos_abs))
                             .replace('{{neutrofilos_segmentados_abs}}', formatNumber(formData.neutrofilos_segmentados_abs))
                             .replace('{{neutrofilos_banda_abs}}', formatNumber(formData.neutrofilos_banda_abs));
  } else if (formType === 'hemoparasites') {
    const compressedBase64 = await compressBase64Image(formData.testFoto);
    htmlContent = htmlContent.replace('{{gusanoCorazon}}', formData.gusanoCorazon==='Positivo'?'<span class="bold is-positive">Positivo</span>':'<span class="bold">Negativo</span>')
                              .replace('{{ehrlichiosis}}', formData.ehrlichiosis==='Positivo'?'<span class="bold is-positive">Positivo</span>':'<span class="bold">Negativo</span>')
                              .replace('{{lyme}}', formData.lyme==='Positivo'?'<span class="bold is-positive">Positivo</span>':'<span class="bold">Negativo</span>')
                              .replace('{{anaplasmosis}}', formData.anaplasmosis==='Positivo'?'<span class="bold is-positive">Positivo</span>':'<span class="bold">Negativo</span>')
                             .replace('{{testFoto}}', compressedBase64);
  }

  htmlContent = htmlContent.replace('./img/top.svg', `data:image/svg+xml;base64,${Buffer.from(topImageContent).toString('base64')}`)
                           .replace('./img/bottom.svg', `data:image/svg+xml;base64,${Buffer.from(bottomImageContent).toString('base64')}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'load' });

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

  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.pdf({ 
    path: outputPath, 
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
}

module.exports = { generatePDF };