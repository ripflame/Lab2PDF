#!/usr/bin/env node
/**
 * Preview Generator Script
 *
 * Generates HTML preview files with mock data for testing layout/spacing.
 * Outputs to templates/preview/ directory.
 *
 * Usage: node scripts/generatePreview.js [configPath]
 *
 * If configPath is provided, only that config is processed.
 * Otherwise, all configs with 'meta' section are processed.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_BASE = path.join(__dirname, '..', 'config', 'tests');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const PREVIEW_DIR = path.join(TEMPLATES_DIR, 'preview');
const PARTIALS_DIR = path.join(__dirname, 'partials');

// Load partials
function loadPartial(name) {
  const filePath = path.join(PARTIALS_DIR, name);
  return fs.readFileSync(filePath, 'utf8');
}

function loadStyle(name) {
  const filePath = path.join(PARTIALS_DIR, 'styles', name);
  return fs.readFileSync(filePath, 'utf8');
}

// Cached partials
const COMMON_STYLES = loadStyle('common.css');
const TABLE_STYLES = loadStyle('table.css');
const TEST_WITH_PHOTO_STYLES = loadStyle('testWithPhoto.css');
const DETAILS_SECTION = loadPartial('details.html');
const DEFAULT_FOOTER = loadPartial('footerDefault.html');

// Mock data for previews
const MOCK_DATA = {
  requerido: 'Requerido por: Dr. Juan Perez',
  fecha: '20/12/2024',
  nombreMascota: 'Firulais',
  especie: 'Canino',
  nombrePropietario: 'Maria Garcia',
  edad: '5 anos',
  raza: 'Labrador',
  sexo: 'Macho',
  telefono: '(916) 123-4567',
  testFoto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTBlMGUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvdG8gZGVsIFRlc3Q8L3RleHQ+PC9zdmc+'
};

/**
 * Generate mock value for a field
 */
function getMockValue(field) {
  const min = parseFloat(field.min) || 0;
  const max = parseFloat(field.max) || 100;
  // Generate a value in the middle of the range
  const value = ((min + max) / 2).toFixed(2);
  return value;
}

/**
 * Generate footer HTML from config
 */
function generateFooter(config) {
  const footer = config.meta?.footer;

  if (!footer || footer.length === 0) {
    return DEFAULT_FOOTER;
  }

  const addressBoxes = footer.map(addr => {
    const lines = addr.address.map(line => `      <p>${line}</p>`).join('\n');
    return `    <div class="address-box">
      <p>${addr.name}</p>
${lines}
      <p>Tel:${addr.tel}</p>
    </div>`;
  }).join('\n');

  return `<footer>
  <div class="address-container">
${addressBoxes}
  </div>
  <img src="../img/bottom.svg" alt="Bottom Graphic" class="graphic graphic-bottom" />
</footer>`;
}

/**
 * Generate table row HTML with mock data
 */
function generateTableRowWithMock(field) {
  const mockValue = getMockValue(field);
  const hasRefValues = field.min !== undefined && field.max !== undefined && field.min !== '' && field.max !== '';

  if (hasRefValues) {
    return `        <tr>
          <td>${field.label}</td>
          <td class="semi-bold">${mockValue}</td>
          <td>${field.min} a ${field.max} ${field.unit || ''}</td>
        </tr>`;
  }

  return `        <tr>
          <td>${field.label}</td>
          <td class="semi-bold">${mockValue}</td>
          <td>${field.unit || ''}</td>
        </tr>`;
}

/**
 * Replace placeholders in details section with mock data
 */
function getDetailsWithMock() {
  let details = DETAILS_SECTION;
  for (const [key, value] of Object.entries(MOCK_DATA)) {
    details = details.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return details;
}

/**
 * Generate preview HTML for table-type tests
 */
function generateTablePreview(config) {
  const meta = config.meta || {};
  const headerTitle = meta.headerTitle || ['Resultados de laboratorio', config.id];
  const title = meta.title || headerTitle.join(' - ');

  // Build table rows from sections or flat fields
  let tableBody = '';

  if (config.sections && config.sections.length > 0) {
    const fieldMap = new Map(config.fields.map(f => [f.id, f]));

    for (const section of config.sections) {
      const hasFields = section.fields.some(id => fieldMap.has(id));
      if (!hasFields) {
        continue;
      }

      tableBody += `        <tr class="bold">
          <td class="center" colspan="3"><i>${section.title.toUpperCase()}</i></td>
        </tr>\n`;

      for (const fieldId of section.fields) {
        const field = fieldMap.get(fieldId);
        if (field) {
          tableBody += generateTableRowWithMock(field) + '\n';
        }
      }
    }
  } else {
    for (const field of config.fields) {
      tableBody += generateTableRowWithMock(field) + '\n';
    }
  }

  // Build method/maquilado section
  let methodSection = '';
  if (meta.maquilado) {
    methodSection = `
    <section class="maquilado-section">
      <div class="maquilado-info">
        <span class="maquilado-label">Maquilado por: </span>
        <span class="maquilado-details">${meta.maquilado}</span>
      </div>
    </section>`;
  } else if (meta.method) {
    methodSection = `
    <section class="maquilado-section">
      <div class="maquilado-info">
        <span class="maquilado-label">Metodo: </span>
        <span class="maquilado-details">${meta.method}</span>
      </div>
    </section>`;
  }

  // Update footer to use relative path for preview
  let footer = generateFooter(config);
  footer = footer.replace('./img/', '../img/');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Preview</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poller+One&family=Inter:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
    />
    <style>
${COMMON_STYLES}
${TABLE_STYLES}
    </style>
  </head>
  <body>
    <header>
      <img src="../img/top.svg" alt="Top Graphic" class="graphic graphic-top" />
      <h1 class="header-title">${headerTitle[0]}<br />${headerTitle[1]}</h1>
    </header>
    ${getDetailsWithMock()}
    <table class="results-table">
      <thead>
        <tr>
          <th>Prueba</th>
          <th>Resultado</th>
          <th>Valor de Referencia</th>
        </tr>
      </thead>
      <tbody>
${tableBody}      </tbody>
    </table>${methodSection}
    ${footer}
  </body>
</html>
`;
}

/**
 * Generate preview HTML for testWithPhoto-type tests
 */
function generateTestWithPhotoPreview(config) {
  const meta = config.meta || {};
  const headerTitle = meta.headerTitle || ['Certificado de prueba rapida', config.id];
  const title = meta.title || headerTitle.join(' - ');
  const testDescription = meta.testDescription ||
    'El analisis mediante inmunoensayo cromatografico revela los siguientes hallazgos en el paciente:';

  const testResults = config.fields.map(field => {
    const result = Math.random() > 0.7 ? 'Positivo' : 'Negativo';
    const resultClass = result === 'Positivo' ? ' class="is-positive"' : '';
    return `            <div class="test-name">${field.label}:</div>
            <div class="test-result"${resultClass}>${result}</div>`;
  }).join('\n');

  let validationSection = '';
  if (meta.validation) {
    validationSection = `
    <section class="report-validation">
      <p class="center">Este certificado ha sido revisado y validado por:</p>
      <p class="center">${meta.validation.name} (Cedula profesional: ${meta.validation.cedula})</p>
      <p class="center">Certificada por el <span class="bold">${meta.validation.org}</span> con Num. de miembro activo: ${meta.validation.memberId}</p>
    </section>`;
  }

  // Update footer to use relative path for preview
  let footer = generateFooter(config);
  footer = footer.replace('./img/', '../img/');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Preview</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poller+One&family=Inter:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
    />
    <style>
${COMMON_STYLES}
${TEST_WITH_PHOTO_STYLES}
    </style>
  </head>
  <body>
    <header>
      <img src="../img/top.svg" alt="Top Graphic" class="graphic graphic-top" />
      <h1 class="header-title">
        ${headerTitle[0]}<br />${headerTitle[1]}
      </h1>
    </header>
    ${getDetailsWithMock()}
    <section class="test-results">
      <p class="test-description">
        ${testDescription}
      </p>
      <div class="columns-wrapper">
        <div class="column">
          <div class="test-grid">
${testResults}
          </div>
        </div>
        <div class="column">
          <img
            src="${MOCK_DATA.testFoto}"
            alt="Test result"
            id="testResultImage"
            class="test-result-image"
          />
        </div>
      </div>
    </section>${validationSection}
    ${footer}
  </body>
</html>
`;
}

/**
 * Find all config files in the config directory
 */
function findConfigFiles() {
  const configs = [];

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.js') && !file.includes('configLoader') && !file.includes('test')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('module.exports') && content.includes('fields')) {
            configs.push(filePath);
          }
        } catch (e) {
          // Skip files that can't be read
        }
      }
    }
  }

  walkDir(CONFIG_BASE);
  return configs;
}

/**
 * Generate preview for a config file
 */
function generatePreviewForConfig(configPath) {
  console.log(`Processing: ${configPath}`);

  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  if (!config.templateFile) {
    console.log(`  Skipping: missing templateFile`);
    return { skipped: true, reason: 'missing files' };
  }

  if (!config.meta) {
    console.log(`  Skipping: no meta section (not an extended config)`);
    return { skipped: true, reason: 'no meta' };
  }

  const previewFileName = config.templateFile.replace('.html', '_preview.html');
  const previewPath = path.join(PREVIEW_DIR, previewFileName);

  let previewHtml;

  if (config.type === 'table') {
    previewHtml = generateTablePreview(config);
  } else if (config.type === 'testWithPhoto') {
    previewHtml = generateTestWithPhotoPreview(config);
  } else {
    console.log(`  Skipping: unknown type "${config.type}"`);
    return { skipped: true, reason: 'unknown type' };
  }

  fs.writeFileSync(previewPath, previewHtml, 'utf8');
  console.log(`  Generated preview: ${previewFileName}`);

  return { skipped: false };
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (!fs.existsSync(PREVIEW_DIR)) {
    fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  }

  if (args.length > 0) {
    const configPath = path.resolve(args[0]);
    if (!fs.existsSync(configPath)) {
      console.error(`Config file not found: ${configPath}`);
      process.exit(1);
    }
    generatePreviewForConfig(configPath);
  } else {
    const configFiles = findConfigFiles();
    console.log(`Found ${configFiles.length} config files\n`);

    let processed = 0;
    let skipped = 0;
    for (const configPath of configFiles) {
      try {
        const result = generatePreviewForConfig(configPath);
        if (result.skipped) {
          skipped++;
        } else {
          processed++;
        }
      } catch (e) {
        console.log(`  Error: ${e.message}`);
        skipped++;
      }
      console.log('');
    }

    console.log(`\nGenerated: ${processed} | Skipped: ${skipped}`);
    console.log(`\nPreview files are in: templates/preview/`);
    console.log(`Open them in a browser to check layout and spacing.`);
  }
}

main();
