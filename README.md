# Lab2PDF

A modern Electron application for generating PDF reports from veterinary laboratory results with
support for multiple test types and laboratory providers.

## Features

- **Hemogram Reports**: Blood count reports for dogs and cats — CaNinna, Labrios (dogs only),
  Zoovet, Bioceli, VetPEC
- **Perfil Completo Reports**: Complete health profile reports for dogs and cats — CaNinna,
  Bioceli, VetPEC
- **Hemoparasites Reports**: Parasitology examination reports (CaNinna, dogs)
- **Distemper/Adenovirus Reports**: Immunological test reports (CaNinna, dogs)
- **Gastroenteritis Reports**: Digestive health examination reports (CaNinna, dogs)
- **SIDA Reports**: FIV/FeLV/heartworm test reports (CaNinna, cats)
- **Clinic-aware branding**: Header/footer artwork and address block switch per requesting clinic,
  with automatic "Maquilado por" attribution when the report is outsourced to a different provider
- **Auto-update**: Automatic background updates via GitHub releases
- **Multi-platform**: Available for macOS and Windows

## Prerequisites

- **Google Chrome or Microsoft Edge must be installed.** PDF rendering uses `puppeteer-core`, which
  does not bundle a browser — it drives your existing Chrome/Edge install instead. This applies to
  the packaged app as well as running from source. Checked paths:
  - **Windows**: Chrome or Edge under `Program Files` / `Program Files (x86)`
  - **macOS**: `/Applications/Google Chrome.app` or `/Applications/Microsoft Edge.app`
  - Linux is not currently supported (no browser path lookup, no build target).
- **Node 24 (arm64)** if building from source — required for the native `sharp` dependency.

## Installation

### From GitHub Releases (Recommended)

1. Go to the [releases page](https://github.com/ripflame/Lab2PDF/releases)
2. Download the latest release for your operating system:
   - **macOS**: `.dmg` file
   - **Windows**: `.exe` installer or portable `.exe`
3. Install or run the application

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/ripflame/Lab2PDF.git
   cd Lab2PDF
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```

## Usage

1. Launch the application
2. Use the sidebar to navigate between different report types
3. Select the requesting clinic, laboratory provider, and species, then fill out the form with
   laboratory results
4. Click "Generar PDF" to generate the report
5. A save dialog opens, defaulting to your Documents folder — pick where to save the PDF

## Development

### Development Mode

```bash
npm run dev
```

### Adding or editing a report config

Report forms and PDF templates are generated from config files under `config/tests/` — do not edit
files in `templates/` directly, they get overwritten. After changing a config:

```bash
npm run generate:templates
npm run generate:preview
```

See [ADD_TEST_TYPE.md](ADD_TEST_TYPE.md) for the full guide to adding a new test type or provider.

### Testing

```bash
npm test
```

### Building

```bash
# macOS
npm run build:mac

# Windows
npm run build:win
```

### Releasing

```bash
# macOS (builds and publishes to GitHub releases)
npm run release:mac

# Windows (builds and publishes to GitHub releases)
npm run release:win

# Remove build output
npm run clean
```

`prebuild:*`/`prerelease:*` hooks reinstall the native `sharp` dependency for the target platform
before building.

### Platform Setup

The application automatically ensures platform-specific dependencies are installed:

```bash
npm run ensure-platform
```

## Architecture

Lab2PDF is config-driven: each test type / provider / species combination is a single JS file under
`config/tests/<test>/providers/<provider>/<species>.js`, loaded through
[`config/configLoader.js`](config/configLoader.js). [`scripts/generateTemplates.js`](scripts/generateTemplates.js)
renders those configs into the form and PDF template HTML under `templates/`, which
[`utils/pdfGenerator.js`](utils/pdfGenerator.js) fills with form data and prints to PDF via
`puppeteer-core`. Requesting clinics (header/footer branding, address, "Maquilado por" attribution)
are a separate registry under `config/clinics/`.

## Technical Stack

- **Electron**: Cross-platform desktop application framework
- **puppeteer-core**: PDF generation engine (drives a system-installed Chrome/Edge, see
  [Prerequisites](#prerequisites))
- **Sharp**: Image processing for uploaded test photos
- **electron-updater** / **electron-log**: Auto-update and logging
- **HTML/CSS/JavaScript**: Frontend technologies

## Version

See the [releases page](https://github.com/ripflame/Lab2PDF/releases) for the current version.

## License

[ISC License](LICENSE)
