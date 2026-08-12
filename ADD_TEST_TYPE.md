# Adding a New Test Type to Lab2PDF

## TLDR

1. Add entry to `config/tests/tests_display_names.json`
2. Create `config/tests/[TEST_ID]/providers/providers_display_names.json`
3. Create `config/tests/[TEST_ID]/providers/[PROVIDER]/[SPECIES].js` for each provider/species combo
4. Run `npm run generate:templates`
5. Run `npm run generate:preview`
6. Run `npm start` and verify

Two test types available: `table` (numeric results with reference ranges) and `testWithPhoto` (rapid
test with positive/negative fields and an image upload).

---

## Detailed Guide

### Test types

**`table`** — Used for tests like hemograma. Fields have `id`, `label`, `min`, `max`, and `unit`.
Fields are organized into `sections` for visual grouping in the PDF. The generated PDF displays each
field in a row with the result, reference range, and unit.

**`testWithPhoto`** — Used for rapid immunoassay tests like hemoparasitos or distemper. Fields have
`id` and `label` only (no ranges). The PDF includes a photo upload slot and displays each field as
positive/negative.

---

### Step 1: Register the test

Edit `config/tests/tests_display_names.json` and add an entry:

```json
{
  "id": "myTest",
  "displayName": "My Test Name"
}
```

The `id` must be a unique camelCase string. It becomes the directory name and is referenced
throughout.

---

### Step 2: Create the provider structure

Create the directory `config/tests/[TEST_ID]/providers/` and add `providers_display_names.json`:

```
config/tests/myTest/
└── providers/
    ├── providers_display_names.json
    └── caninna/
        └── canino.js
```

`providers_display_names.json` lists only the providers that support this test:

```json
[{ "id": "caninna", "displayName": "Veterinaria CaNinna" }]
```

Provider `id` values must match existing provider directory names used by other tests.

---

### Step 3: Create config JS files

Create one `.js` file per provider/species combination. The filename is the species (e.g.,
`canino.js`, `felino.js`).

#### `testWithPhoto` example

```js
module.exports = {
  id: "myTest_caninna",
  formFile: "myTest_caninna_canino.html",
  templateFile: "myTest_caninna_canino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rápida de my test",
    headerTitle: ["Certificado de prueba rápida", "my test"],
    formTitle: "RESULTADOS DE LABORATORIO<br>MY TEST",
    legendTitle: "My Test",
    testDescription:
      "El análisis mediante inmunoensayo cromatográfico revela los siguientes hallazgos en el paciente:",
    validation: {
      name: "MVZ Name Here",
      cedula: "00000000",
      org: "ORG",
      memberId: "0000-000",
    },
    additionalStudiesNote: "Nota: Esta es una prueba rapida de tamizaje.",
    maquilado: "Lab or clinic name and address shown when the report is outsourced.",
  },

  fields: [
    { id: "fieldOne", label: "Field One" },
    { id: "fieldTwo", label: "Field Two" },
  ],
};
```

#### `table` example

```js
module.exports = {
  id: "myTest_caninna",
  formFile: "myTest_caninna_canino.html",
  templateFile: "myTest_caninna_canino_template.html",
  type: "table",

  meta: {
    title: "My table test",
    headerTitle: ["Resultados de laboratorio", "My table test"],
    formTitle: "RESULTADOS DE LABORATORIO<br />MY TABLE TEST",
    method: "Description of the analysis method used.",
    maquilado: "Lab or clinic name and address shown when the report is outsourced.",
  },

  sections: [
    {
      title: "Section Name",
      fields: ["fieldOne", "fieldTwo"],
    },
  ],

  fields: [
    {
      id: "fieldOne",
      templateField: "fieldOne",
      label: "Field One label",
      min: "0.00",
      max: "10.00",
      unit: "g/L",
    },
    {
      id: "fieldTwo",
      templateField: "fieldTwo",
      label: "Field Two label",
      min: "5.00",
      max: "20.00",
      unit: "%",
    },
  ],
};
```

**`id`** — `[testId]_[providerId]`, no species suffix. **`formFile` / `templateFile`** —
`[testId]_[providerId]_[species].html` and `[testId]_[providerId]_[species]_template.html`. These
must match exactly — the generator uses them as output filenames. **`templateField`** — For `table`
type, matches the `id` unless you need a different binding key.

**`meta.maquilado`** — Every existing config sets this, and `utils/pdfGenerator.js` reads it
unguarded whenever the selected clinic's `linkedProvider` (see `config/clinics/*.json`) does not
match the provider chosen on the form. In that case the report's validation section is replaced with
a "Maquilado por: [this text]" attribution, so treat it as required rather than optional. Example
from `config/tests/hemograma/providers/caninna/canino.js`:

```js
maquilado:
  "Veterinaria CaNinna. Emiliano Zapata, Tab.: Calle Moctezuma entre Libertad y Vicente Guerrero, " +
  "Centro. Tel:(934) 113-5079. Palenque, Chis.: Avenida Nicolas Bravo entre Abasolo e " +
  "Independencia, Centro. Tel:(916) 124-6050.",
```

**`meta.extraStyles`** — Optional. A raw CSS string appended after the base table/testWithPhoto
styles when the template is generated (or previewed). Used to tweak layout for a specific
provider/species without touching the shared stylesheets. Example from
`config/tests/perfilCompleto/providers/vetpec/canino.js`:

```js
extraStyles: `
.results-table { font-size: 14px; margin: 4px auto; }
`,
```

**`meta.footer`** — Optional. An array of address boxes to render in the PDF footer instead of the
default one:

```js
footer: [
  { name: "Clinic Name", address: ["Street line 1", "Street line 2"], tel: "123-456-7890" },
],
```

Omit it to use the default footer partial (`scripts/partials/footerDefault.html`).

---

### Step 4: Generate templates

```sh
npm run generate:templates
```

This reads all config JS files and outputs the HTML form and PDF template files into `templates/`.
Do not edit these files manually — they are overwritten on every run. Pass a single config's path
to regenerate just that one while iterating, e.g.
`node scripts/generateTemplates.js config/tests/myTest/providers/caninna/canino.js`.

---

### Step 5: Generate previews

```sh
npm run generate:preview
```

Outputs preview HTML files with mock data so you can inspect the PDF layout in a browser without
entering real data.

---

### Step 6: Test

```sh
npm start
```

Verify:

- The new test appears in the sidebar
- Selecting it populates the provider dropdown with the entries from `providers_display_names.json`
- Selecting a provider and species loads the form
- Filling out the form and generating produces a valid PDF

---

### Species and clinics

**Species come from the filesystem, not a registry.** `configLoader.getSpeciesByTestAndProvider`
lists the `.js` files present in `config/tests/[TEST_ID]/providers/[PROVIDER]/` — adding
`felino.js` next to `canino.js` is enough to make felino selectable, no other file to edit.

**Clinics are a separate config from tests/providers.** `config/clinics/*.json` defines the
requesting clinics offered in the form ("Requerido por"). Each entry controls `headerImage`,
`footerImage`, `address`, and `linkedProvider` (the provider that clinic's own lab work belongs to
— see `meta.maquilado` above). Adding a new test type does not require touching this directory,
but if you add a new provider, make sure at least one clinic's `linkedProvider` matches it or every
report from that provider will show the maquilado attribution.
