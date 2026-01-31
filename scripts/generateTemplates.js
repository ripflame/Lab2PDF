#!/usr/bin/env node
/**
 * Template Generator Script
 *
 * Reads config files from config/tests/ and generates:
 * - Form HTML files (for Electron app input)
 * - Template HTML files (for PDF generation via Puppeteer)
 *
 * Usage: node scripts/generateTemplates.js [configPath]
 *
 * If configPath is provided, only that config is processed.
 * Otherwise, all configs with 'meta' section are processed.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_BASE = path.join(__dirname, '..', 'config', 'tests');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
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
  <img src="./img/bottom.svg" alt="Bottom Graphic" class="graphic graphic-bottom" />
</footer>`;
}

/**
 * Generate table row HTML for a field
 */
function generateTableRow(field, useLabels = false) {
  const fieldId = field.templateField || field.id;
  const hasRefValues = field.min !== undefined && field.max !== undefined;

  if (useLabels) {
    if (hasRefValues) {
      return `        <tr {{row_${fieldId}}}>
          <td>{{label_${fieldId}}}</td>
          <td class="semi-bold">{{${fieldId}}}</td>
          <td>{{unit_${fieldId}}}</td>
        </tr>`;
    }
    return `        <tr {{row_${fieldId}}}>
          <td>{{label_${fieldId}}}</td>
          <td class="semi-bold">{{${fieldId}}}</td>
          <td></td>
        </tr>`;
  }

  if (hasRefValues && field.min !== '' && field.max !== '') {
    return `        <tr {{row_${fieldId}}}>
          <td>${field.label}</td>
          <td class="semi-bold">{{${fieldId}}}</td>
          <td>{{minValue_${fieldId}}} a {{maxValue_${fieldId}}} {{unit_${fieldId}}}</td>
        </tr>`;
  }

  return `        <tr {{row_${fieldId}}}>
          <td>${field.label}</td>
          <td class="semi-bold">{{${fieldId}}}</td>
          <td></td>
        </tr>`;
}

/**
 * Recursively process fields array that may contain field IDs or nested sections
 */
function processFieldsRecursive(items, fieldMap, useLabels, depth = 0) {
  let html = '';
  for (const item of items) {
    if (typeof item === 'string') {
      // It's a field ID
      const field = fieldMap.get(item);
      if (field) {
        html += generateTableRow(field, useLabels) + '\n';
      }
    } else if (typeof item === 'object' && item.title && item.fields) {
      // It's a nested section - render subsection header (same style, not uppercase)
      html += `        <tr class="bold">
          <td class="center" colspan="3"><i>${item.title}</i></td>
        </tr>\n`;
      // Recursively process nested fields
      html += processFieldsRecursive(item.fields, fieldMap, useLabels, depth + 1);
    }
  }
  return html;
}

/**
 * Check if a fields array has any valid fields (including nested)
 */
function hasValidFields(items, fieldMap) {
  for (const item of items) {
    if (typeof item === 'string' && fieldMap.has(item)) {
      return true;
    } else if (typeof item === 'object' && item.fields) {
      if (hasValidFields(item.fields, fieldMap)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Collect all fields from a section, including nested sections
 */
function collectFieldsRecursive(items, fieldMap) {
  const result = [];
  for (const item of items) {
    if (typeof item === 'string') {
      const field = fieldMap.get(item);
      if (field) result.push(field);
    } else if (typeof item === 'object' && item.fields) {
      result.push(...collectFieldsRecursive(item.fields, fieldMap));
    }
  }
  return result;
}

/**
 * Generate form fields HTML for an array of field objects
 */
function generateFormFieldsHtml(fields, columnsPerRow = 3) {
  if (fields.length === 0) return '';

  const fieldsPerColumn = Math.ceil(fields.length / columnsPerRow);
  const columns = [];
  for (let i = 0; i < columnsPerRow; i++) {
    const columnFields = fields.slice(i * fieldsPerColumn, (i + 1) * fieldsPerColumn);
    if (columnFields.length > 0) {
      columns.push(columnFields);
    }
  }

  const columnsHtml = columns.map(columnFields => {
    const inputs = columnFields.map(field => {
      return `        <label class="label" for="${field.id}">${field.label}:</label>
        <input class="input-number" type="number" step="any" id="${field.id}" required />`;
    }).join('\n');
    return `      <div class="form-column">
${inputs}
      </div>`;
  }).join('\n');

  return `    <div class="form-columns">
${columnsHtml}
    </div>`;
}

/**
 * Recursively process section fields and generate form HTML with nested fieldsets
 */
function processFormFieldsRecursive(items, fieldMap, columnsPerRow = 3) {
  let html = '';
  let topLevelFields = [];

  for (const item of items) {
    if (typeof item === 'string') {
      // Collect top-level field IDs
      const field = fieldMap.get(item);
      if (field) {
        topLevelFields.push(field);
      }
    } else if (typeof item === 'object' && item.title && item.fields) {
      // Before processing nested section, output any accumulated top-level fields
      if (topLevelFields.length > 0) {
        html += generateFormFieldsHtml(topLevelFields, columnsPerRow) + '\n';
        topLevelFields = [];
      }

      // Process nested section as a nested fieldset
      const nestedFields = collectFieldsRecursive(item.fields, fieldMap);
      if (nestedFields.length > 0) {
        html += `    <fieldset class="fieldset nested-fieldset">
      <legend class="legend">${item.title}</legend>
${generateFormFieldsHtml(nestedFields, columnsPerRow)}
    </fieldset>\n`;
      }
    }
  }

  // Output any remaining top-level fields
  if (topLevelFields.length > 0) {
    html += generateFormFieldsHtml(topLevelFields, columnsPerRow) + '\n';
  }

  return html;
}

/**
 * Generate PDF template HTML for table-type tests
 */
function generateTableTemplate(config) {
  const meta = config.meta || {};
  const headerTitle = meta.headerTitle || ['Resultados de laboratorio', config.id];
  const title = meta.title || headerTitle.join(' - ');
  const useLabels = meta.useLabels || false;

  // Build table rows from sections or flat fields
  let tableBody = '';

  if (config.sections && config.sections.length > 0) {
    const fieldMap = new Map(config.fields.map(f => [f.id, f]));

    for (const section of config.sections) {
      // Check if section has any valid fields (including nested)
      if (!hasValidFields(section.fields, fieldMap)) {
        continue;
      }

      // Top-level section header
      tableBody += `        <tr class="bold">
          <td class="center" colspan="3"><i>${section.title.toUpperCase()}</i></td>
        </tr>\n`;

      // Process fields recursively (handles both strings and nested sections)
      tableBody += processFieldsRecursive(section.fields, fieldMap, useLabels);
    }
  } else {
    for (const field of config.fields) {
      tableBody += generateTableRow(field, useLabels) + '\n';
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
        <span class="maquilado-label">Método: </span>
        <span class="maquilado-details">${meta.method}</span>
      </div>
    </section>`;
  }

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
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
      <img src="./img/top.svg" alt="Top Graphic" class="graphic graphic-top" />
      <h1 class="header-title">${headerTitle[0]}<br />${headerTitle[1]}</h1>
    </header>
    ${DETAILS_SECTION}
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
    ${generateFooter(config)}
  </body>
</html>
`;
}

/**
 * Generate PDF template HTML for testWithPhoto-type tests
 */
function generateTestWithPhotoTemplate(config) {
  const meta = config.meta || {};
  const headerTitle = meta.headerTitle || ['Certificado de prueba rapida', config.id];
  const title = meta.title || headerTitle.join(' - ');
  const testDescription = meta.testDescription ||
    'El analisis mediante inmunoensayo cromatografico revela los siguientes hallazgos en el paciente:';

  const testResults = config.fields.map(field => {
    return `            <div class="test-name">${field.label}:</div>
            <div class="test-result">{{${field.id}}}</div>`;
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

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
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
      <img src="./img/top.svg" alt="Top Graphic" class="graphic graphic-top" />
      <h1 class="header-title">
        ${headerTitle[0]}<br />${headerTitle[1]}
      </h1>
    </header>
    ${DETAILS_SECTION}
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
            src="{{testFoto}}"
            alt="Test result"
            id="testResultImage"
            class="test-result-image"
          />
        </div>
      </div>
    </section>${validationSection}
    ${generateFooter(config)}
  </body>
</html>
`;
}

/**
 * Generate form HTML for table-type tests
 */
function generateTableForm(config) {
  const meta = config.meta || {};
  const formTitle = meta.formTitle || `RESULTADOS DE LABORATORIO<br />${config.id.toUpperCase()}`;
  const formId = `formulario${config.id.charAt(0).toUpperCase() + config.id.slice(1)}`;

  let formContent = '';

  if (config.sections && config.sections.length > 0) {
    const fieldMap = new Map(config.fields.map(f => [f.id, f]));

    for (const section of config.sections) {
      // Check if section has any valid fields (including nested)
      if (!hasValidFields(section.fields, fieldMap)) {
        continue;
      }

      const columnsPerRow = section.columns || 3;

      // Check if section has nested sections
      const hasNestedSections = section.fields.some(
        item => typeof item === 'object' && item.title && item.fields
      );

      if (hasNestedSections) {
        // Use recursive processing for nested fieldsets
        const innerContent = processFormFieldsRecursive(section.fields, fieldMap, columnsPerRow);
        formContent += `  <fieldset class="fieldset">
    <legend class="legend">${section.title}</legend>
${innerContent}  </fieldset>\n`;
      } else {
        // Flat section - collect all fields and render normally
        const sectionFields = collectFieldsRecursive(section.fields, fieldMap);
        const fieldsPerColumn = Math.ceil(sectionFields.length / columnsPerRow);
        const columns = [];
        for (let i = 0; i < columnsPerRow; i++) {
          const columnFields = sectionFields.slice(i * fieldsPerColumn, (i + 1) * fieldsPerColumn);
          if (columnFields.length > 0) {
            columns.push(columnFields);
          }
        }

        const columnsHtml = columns.map(columnFields => {
          const inputs = columnFields.map(field => {
            return `        <label class="label" for="${field.id}">${field.label}:</label>
        <input class="input-number" type="number" step="any" id="${field.id}" required />`;
          }).join('\n');
          return `      <div class="form-column">
${inputs}
      </div>`;
        }).join('\n');

        formContent += `  <fieldset class="fieldset">
    <legend class="legend">${section.title}</legend>
    <div class="form-columns">
${columnsHtml}
    </div>
  </fieldset>\n`;
      }
    }
  } else {
    const columnsPerRow = 3;
    const fieldsPerColumn = Math.ceil(config.fields.length / columnsPerRow);
    const columns = [];
    for (let i = 0; i < columnsPerRow; i++) {
      columns.push(config.fields.slice(i * fieldsPerColumn, (i + 1) * fieldsPerColumn));
    }

    const columnsHtml = columns.map(columnFields => {
      const inputs = columnFields.map(field => {
        return `        <label class="label" for="${field.id}">${field.label}:</label>
        <input class="input-number" type="number" step="any" id="${field.id}" required />`;
      }).join('\n');
      return `      <div class="form-column">
${inputs}
      </div>`;
    }).join('\n');

    formContent = `  <fieldset class="fieldset">
    <legend class="legend">Valores</legend>
    <div class="form-columns">
${columnsHtml}
    </div>
  </fieldset>\n`;
  }

  return `<!-- Generated form content -->
<h1 class="title">${formTitle}</h1>
<div id="${formId}" class="form">
${formContent}</div>
`;
}

/**
 * Generate form HTML for testWithPhoto-type tests
 */
function generateTestWithPhotoForm(config) {
  const meta = config.meta || {};
  const formTitle = meta.formTitle || `RESULTADOS DE LABORATORIO<br />${config.id.toUpperCase()}`;
  const formId = `formulario${config.id.charAt(0).toUpperCase() + config.id.slice(1)}`;
  const legendTitle = meta.legendTitle || config.id;

  const radioGroups = config.fields.map(field => {
    return `        <label class="label" for="${field.id}">${field.label}</label>
        <div class="radio-group">
          <input type="radio" id="${field.id}Positivo" name="${field.id}" value="Positivo" required>
          <label class="label" for="${field.id}Positivo">Positivo</label>
          <input type="radio" id="${field.id}Negativo" name="${field.id}" value="Negativo" checked>
          <label class="label" for="${field.id}Negativo">Negativo</label>
        </div>`;
  }).join('\n');

  return `<h1 class="title">${formTitle}</h1>
<div id="${formId}" class="form">
  <fieldset class="fieldset">
    <legend class="legend">${legendTitle}</legend>
    <div class="form-columns">
      <div class="form-column">
${radioGroups}
      </div>
      <div class="form-column">
        <label class="label" for="testFoto">Seleccionar foto:</label>
        <input type="file" id="testFoto" accept="image/jpeg, image/png, image/webp" required>
        <img id="testFotoThumbnail" class="testFotoThumbnail" src="" alt="Foto del test">
      </div>
    </div>
  </fieldset>
</div>
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
 * Generate templates for a config file
 */
function generateTemplatesForConfig(configPath) {
  console.log(`Processing: ${configPath}`);

  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  if (!config.formFile || !config.templateFile) {
    console.log(`  Skipping: missing formFile or templateFile`);
    return { skipped: true, reason: 'missing files' };
  }

  if (!config.meta) {
    console.log(`  Skipping: no meta section (not an extended config)`);
    return { skipped: true, reason: 'no meta' };
  }

  const formPath = path.join(TEMPLATES_DIR, config.formFile);
  const templatePath = path.join(TEMPLATES_DIR, config.templateFile);

  let formHtml, templateHtml;

  if (config.type === 'table') {
    formHtml = generateTableForm(config);
    templateHtml = generateTableTemplate(config);
  } else if (config.type === 'testWithPhoto') {
    formHtml = generateTestWithPhotoForm(config);
    templateHtml = generateTestWithPhotoTemplate(config);
  } else {
    console.log(`  Skipping: unknown type "${config.type}"`);
    return { skipped: true, reason: 'unknown type' };
  }

  fs.writeFileSync(formPath, formHtml, 'utf8');
  console.log(`  Generated form: ${config.formFile}`);

  fs.writeFileSync(templatePath, templateHtml, 'utf8');
  console.log(`  Generated template: ${config.templateFile}`);

  return { skipped: false };
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);

  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  if (args.length > 0) {
    const configPath = path.resolve(args[0]);
    if (!fs.existsSync(configPath)) {
      console.error(`Config file not found: ${configPath}`);
      process.exit(1);
    }
    generateTemplatesForConfig(configPath);
  } else {
    const configFiles = findConfigFiles();
    console.log(`Found ${configFiles.length} config files\n`);

    let processed = 0;
    let skipped = 0;
    for (const configPath of configFiles) {
      try {
        const result = generateTemplatesForConfig(configPath);
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

    console.log(`\nGenerated: ${processed} | Skipped: ${skipped} (no meta section)`);
  }
}

main();
