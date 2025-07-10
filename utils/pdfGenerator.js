const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { app } = require("electron");

/**
 * Application configuration
 * Contains paths, browser configurations, image processing settings and PDF output options
 */
const CONFIG = {
  // Use a getter to lazily evaluate the log path when it's accessed
  get logPath() {
    return typeof app !== "undefined" && app !== null
      ? path.join(app.getPath("userData"), "error.log")
      : path.join(os.tmpdir(), "app-error.log");
  },
  templateDir: path.join(__dirname, "../templates"),
  imageDir: path.join(__dirname, "../templates/img"),
  configDir: path.join(__dirname, "../config"),
  get configLoader() {
    return require(path.join(this.configDir, "configLoader"));
  },
  chromePaths: {
    win32: [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ],
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ],
  },
  imageCompression: {
    defaultQuality: 70,
    width: 350,
  },
  pdfOptions: {
    format: "letter",
    printBackground: true,
    margin: { top: "0in", right: "0in", bottom: "0in", left: "0in" },
  },
};

/**
 * Application error logger
 * Records error details to file with timestamps for debugging
 */
class Logger {
  static logError(error) {
    const errorMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
    fs.appendFileSync(CONFIG.logPath, errorMessage);
    console.error(errorMessage);
  }
}

/**
 * Data formatting utilities for displaying values in templates
 * Handles formatting of numbers, phone numbers, dates and age displays
 */
class Formatters {
  static number(number) {
    return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
  }

  static phoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
  }

  static date(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  static age(age) {
    return age === "1" ? "1 año" : `${age} años`;
  }
}

/**
 * Image processing utilities
 * Handles compression, format conversion and loading of image assets
 */
class ImageProcessor {
  /**
   * Compresses and resizes a Base64 encoded image
   * Preserves the original format while optimizing file size
   */
  static async compressBase64Image(base64String, quality = CONFIG.imageCompression.defaultQuality) {
    try {
      // Extract Base64 data (removing metadata prefix)
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Get image metadata to determine format
      const metadata = await sharp(imageBuffer).metadata();

      // Resize image and apply format-specific compression
      let processedImage = sharp(imageBuffer).resize({
        width: CONFIG.imageCompression.width,
      });

      switch (metadata.format) {
        case "jpeg":
          processedImage = processedImage.jpeg({ quality });
          break;
        case "png":
          processedImage = processedImage.png({ compressionLevel: 9 });
          break;
        case "webp":
          processedImage = processedImage.webp({ quality });
          break;
        default:
          throw new Error(`Unsupported image format: ${metadata.format}`);
      }

      // Convert back to Base64
      const compressedBuffer = await processedImage.toBuffer();
      const compressedBase64 = `data:image/${metadata.format};base64,${compressedBuffer.toString("base64")}`;

      return compressedBase64;
    } catch (error) {
      Logger.logError(new Error(`Image compression error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Loads an SVG image file and returns it as a Base64 encoded data URL
   */
  static loadImageAsBase64(imagePath) {
    try {
      const imageContent = fs.readFileSync(imagePath, "utf8");
      return `data:image/svg+xml;base64,${Buffer.from(imageContent).toString("base64")}`;
    } catch (error) {
      Logger.logError(new Error(`Failed to load image ${imagePath}: ${error.message}`));
      throw error;
    }
  }
}

/**
 * Handles headless browser operations for PDF rendering
 * Manages browser instances, page configuration and rendering wait states
 */
class BrowserManager {
  /**
   * Locates Chrome or Edge executable based on the current platform
   */
  static getChromePath() {
    const platform = process.platform;
    const paths = CONFIG.chromePaths[platform];

    if (!paths) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    for (const browserPath of paths) {
      if (fs.existsSync(browserPath)) {
        return browserPath;
      }
    }

    throw new Error("Chrome or Edge browser not found. Please install one of them.");
  }

  /**
   * Creates and configures a new headless browser instance
   */
  static async createBrowser() {
    try {
      const chromePath = this.getChromePath();
      return await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } catch (error) {
      Logger.logError(new Error(`Browser launch error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Ensures all images in the page are fully loaded before PDF generation
   */
  static async waitForImagesLoad(page) {
    try {
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(
          images.map((img) => {
            if (img.complete) return;
            return new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
          }),
        );
      });

      // Additional delay for complete rendering
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      Logger.logError(new Error(`Images loading error: ${error.message}`));
      throw error;
    }
  }
}

class TemplateProcessor {
  constructor(configTemplate) {
    this.config = configTemplate;
  }

  /**
   * Process a template using provider-specific configuration
   **/
  async processTemplate(htmlContent, formData) {
    try {
      //Process base template common to all forms
      htmlContent = this.processBaseTemplate(htmlContent, formData);

      if (this.config.type === "table") {
        return this.processLabResultsTemplate(htmlContent, formData);
      } else if (this.config.type === "testWithPhoto") {
        return await this.processTestWithPhotoTemplate(htmlContent, formData);
      } else {
        throw new Error(`Unknown test type: ${this.config.id}`);
      }
    } catch (error) {
      Logger.logError(new Error(`Template processing error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Processes common template elements shared across all form types
   * Inserts patient and owner information
   */
  processBaseTemplate(htmlContent, formData) {
    try {
      return htmlContent
        .replace("{{requerido}}", formData.requerido)
        .replace("{{fecha}}", Formatters.date(formData.fecha))
        .replace("{{nombreMascota}}", formData.nombreMascota)
        .replace("{{especie}}", formData.especie)
        .replace("{{raza}}", formData.raza)
        .replace("{{nombrePropietario}}", formData.nombrePropietario)
        .replace("{{edad}}", formData.edad)
        .replace("{{sexo}}", formData.sexo)
        .replace("{{telefono}}", Formatters.phoneNumber(formData.telefono))
        .replace(
          "./img/top.svg",
          ImageProcessor.loadImageAsBase64(path.join(CONFIG.imageDir, "top.svg")),
        )
        .replace(
          "./img/bottom.svg",
          ImageProcessor.loadImageAsBase64(path.join(CONFIG.imageDir, "bottom.svg")),
        );
    } catch (error) {
      Logger.logError(new Error(`Base template processing error: ${error.message}`));
      throw error;
    }
  }
  /**
   * Process lab results templates using config (hemogram, perfil completo, etc.)
   */
  processLabResultsTemplate(htmlContent, formData) {
    try {
      // Process each field according to the configuration
      for (const field of this.config.fields) {
        const formValue = formData[field.id];
        const templateField = field.templateField || field.id;
        const formattedValue = this.formatTableTestResult(templateField, formValue);
        const minValue = field.min;
        const maxValue = field.max;
        const unit = field.unit;
        if (this.isHighOrLow(formValue, minValue, maxValue) === -1) {
          htmlContent = htmlContent.replace(`{{row_${templateField}}}`, 'class="highlight_low"');
        } else if (this.isHighOrLow(formValue, minValue, maxValue) === 1) {
          htmlContent = htmlContent.replace(`{{row_${templateField}}}`, 'class="highlight_high"');
        } else {
          htmlContent = htmlContent.replace(`{{row_${templateField}}}`, 'class=""');
        }
        htmlContent = htmlContent.replace(`{{${templateField}}}`, formattedValue);
        htmlContent = htmlContent.replace(`{{minValue_${templateField}}}`, minValue);
        htmlContent = htmlContent.replace(`{{maxValue_${templateField}}}`, maxValue);
        htmlContent = htmlContent.replace(`{{unit_${templateField}}}`, unit);
      }

      return htmlContent;
    } catch (error) {
      Logger.logError(new Error(`Lab results template processing error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Processes templates that include test results with photo evidence
   * Handles hemoparasites, distemper, and gastroenteritis test types
   */
  async processTestWithPhotoTemplate(htmlContent, formData) {
    try {
      // Compress and process the test photo
      const compressedBase64 = await ImageProcessor.compressBase64Image(formData.testFoto);

      // Replace test results fields
      for (const field of this.config.fields) {
        const formValue = formData[field.id];

        // Format the result with appropriate styling
        const formattedValue = this.formatTestWithPhotoResult(formValue);

        // Replace in template
        htmlContent = htmlContent.replace(`{{${field.id}}}`, formattedValue);
      }

      // Replace the photo
      htmlContent = htmlContent.replace("{{testFoto}}", compressedBase64);

      return htmlContent;
    } catch (error) {
      Logger.logError(new Error(`Test with photo template processing error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Formats test results with appropriate styling based on result value
   */
  formatTestWithPhotoResult(result) {
    return result === "Positivo"
      ? '<span class="bold is-positive">Positivo</span>'
      : '<span class="bold">Negativo</span>';
  }

  isHighOrLow(value, min, max) {
    const hasValidRange = min != null && max != null && min !== "" && max !== "";
    if (hasValidRange) {
      if (Number(value) < Number(min)) {
        return -1;
      } else if (Number(value) > Number(max)) {
        return 1;
      }
    }
    return 0;
  }

  formatTableTestResult(fieldId, result) {
    const f = Formatters.number;
    const field = this.config.fields.find((field) => fieldId === field.id);

    if (!field) {
      throw new Error("Field not found in config file");
    }

    let formattedResult = f(result);

    const hasValidRange =
      field.min != null && field.max != null && field.min !== "" && field.max !== "";

    if (hasValidRange) {
      if (Number(result) < Number(field.min)) {
        return "&darr; " + formattedResult;
      } else if (Number(result) > Number(field.max)) {
        return "&uarr; " + formattedResult;
      }
    }

    return formattedResult;
  }
}

/**
 * Main PDF generation functionality
 * Coordinates template selection, processing and rendering
 */
class PDFGenerator {
  /**
   * Generates a PDF from veterinary form data
   *
   * @param {Object} formData - The data to be inserted into the template
   * @param {string} outputPath - Path where the PDF will be saved
   * @param {string} formType - Type of form (provider_testType_species)
   * @returns {string} - Path to the generated PDF file
   */
  static async generatePDF(formData, outputPath, formType) {
    let browser;

    try {
      let provider = "caninna"; //Default provider
      if (formType.includes("_")) {
        const parts = formType.split("_");
        formType = parts[0]; //Base form type (e.g. hemogram)
        provider = parts[1]; //Provider name (e.g. caninna)
      }
      const species = formData.especie.toLowerCase();

      const config = CONFIG.configLoader.getConfigForTestProviderAndSpecies(
        formType,
        provider,
        species,
      );

      const templatePath = path.join(CONFIG.templateDir, config.templateFile);
      let htmlContent = fs.readFileSync(templatePath, "utf8");

      const templateProcessor = new TemplateProcessor(config);

      htmlContent = await templateProcessor.processTemplate(htmlContent, formData);

      browser = await BrowserManager.createBrowser();
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "load" });
      await BrowserManager.waitForImagesLoad(page);
      await page.pdf({ ...CONFIG.pdfOptions, path: outputPath });

      return outputPath;
    } catch (error) {
      Logger.logError(new Error(`PDF generation error: ${error.message}`));
      throw error;
    } finally {
      if (browser) {
        await browser.close().catch((err) => {
          Logger.logError(new Error(`Browser close error; ${err.message}`));
        });
      }
    }
  }
}

module.exports = { generatePDF: PDFGenerator.generatePDF };
