# Lab2PDF

A modern Electron application for generating PDF reports from veterinary laboratory results with support for multiple test types and laboratory providers.

## Features

- **Hemogram Reports**: Generate comprehensive blood count reports for dogs and cats
- **Hemoparasites Reports**: Create parasitology examination reports
- **Distemper/Adenovirus Reports**: Generate immunological test reports
- **Gastroenteritis Reports**: Create digestive health examination reports
- **Perfil Completo Reports**: Generate complete health profile reports
- **SIDA Reports**: Create FIV/FeLV test reports for cats
- **Multiple Laboratory Providers**: Support for CaNinna, Labrios, Zoovet, and Bioceli
- **Auto-update**: Automatic background updates via GitHub releases
- **Multi-platform**: Available for macOS, Windows, and Linux

## Installation

### From GitHub Releases (Recommended)

1. Go to the [releases page](https://github.com/ripflame/Lab2PDF/releases)
2. Download the latest release for your operating system:
   - **macOS**: `.dmg` file
   - **Windows**: `.exe` installer or portable `.exe`
   - **Linux**: `.AppImage`, `.deb`, or `.rpm`
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
3. Fill out the form with laboratory results
4. Click "Generar PDF" to generate the report
5. The generated PDF will be saved to your documents folder

## Development

### Development Mode
```bash
npm run dev
```

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

### Platform Setup
The application automatically ensures platform-specific dependencies are installed:
```bash
npm run ensure-platform
```

## Technical Stack

- **Electron**: Cross-platform desktop application framework
- **Puppeteer**: PDF generation engine
- **Sharp**: Image processing
- **HTML/CSS/JavaScript**: Frontend technologies

## Version

Current version: 1.3.1

## License

ISC License
