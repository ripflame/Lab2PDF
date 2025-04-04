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

/**
 * Template processing for different veterinary form types
 * Handles data insertion, formatting and template-specific logic
 */
class TemplateProcessor {
  /**
   * Processes common template elements shared across all form types
   * Inserts patient and owner information
   */
  static async processBaseTemplate(htmlContent, formData) {
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
   * Processes hemogram-specific template data
   * Inserts and formats blood test values
   */
  static processHemogramTemplate(htmlContent, formData) {
    try {
      const f = Formatters.number;
      return htmlContent
        .replace("{{eritrocitos}}", f(formData.eritrocitos))
        .replace("{{hemoglobina}}", f(formData.hemoglobina))
        .replace("{{hematocrito}}", f(formData.hematocrito))
        .replace("{{vgm}}", f(formData.volumenGlobularMedio))
        .replace("{{hpe}}", f(formData.hemoglobinaPromedio))
        .replace("{{cmh}}", f(formData.concentracionMediaHemoglobina))
        .replace("{{plaquetas}}", f(formData.plaquetas))
        .replace("{{leucocitos}}", f(formData.leucocitos))
        .replace("{{monocitos_rel}}", f(formData.monocitos_rel))
        .replace("{{linfocitos_rel}}", f(formData.linfocitos_rel))
        .replace("{{eosinofilos_rel}}", f(formData.eosinofilos_rel))
        .replace("{{basofilos_rel}}", f(formData.basofilos_rel))
        .replace("{{neutrofilos_segmentados_rel}}", f(formData.neutrofilos_segmentados_rel))
        .replace("{{neutrofilos_banda_rel}}", f(formData.neutrofilos_banda_rel))
        .replace("{{monocitos_abs}}", f(formData.monocitos_abs))
        .replace("{{linfocitos_abs}}", f(formData.linfocitos_abs))
        .replace("{{eosinofilos_abs}}", f(formData.eosinofilos_abs))
        .replace("{{basofilos_abs}}", f(formData.basofilos_abs))
        .replace("{{neutrofilos_segmentados_abs}}", f(formData.neutrofilos_segmentados_abs))
        .replace("{{neutrofilos_banda_abs}}", f(formData.neutrofilos_banda_abs));
    } catch (error) {
      Logger.logError(new Error(`Hemogram template processing error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Processes hemogram-palenque-specific template data
   * Inserts and formats blood test values
   */
  static processHemogram_PalenqueTemplate(htmlContent, formData) {
    try {
      const f = Formatters.number;
      return htmlContent
        .replace("{{wbc}}", f(formData.wbc))
        .replace("{{linfocitos_abs}}", f(formData.linfocitos_abs))
        .replace("{{monocitos_abs}}", f(formData.monocitos_abs))
        .replace("{{granulocitos_abs}}", f(formData.granulocitos_abs))
        .replace("{{eosinofilos_abs}}", f(formData.eosinofilos_abs))
        .replace("{{linfocitos_rel}}", f(formData.linfocitos_rel))
        .replace("{{monocitos_rel}}", f(formData.monocitos_rel))
        .replace("{{granulocitos_rel}}", f(formData.granulocitos_rel))
        .replace("{{eosinofilos_rel}}", f(formData.eosinofilos_rel))
        .replace("{{rbc}}", f(formData.rbc))
        .replace("{{hgb}}", f(formData.hgb))
        .replace("{{hct}}", f(formData.hct))
        .replace("{{mcv}}", f(formData.mcv))
        .replace("{{mch}}", f(formData.mch))
        .replace("{{mchc}}", f(formData.mchc))
        .replace("{{rdw_cv}}", f(formData.rdw_cv))
        .replace("{{rdw_sd}}", f(formData.rdw_sd))
        .replace("{{plt}}", f(formData.plt))
        .replace("{{pct}}", f(formData.pct))
        .replace("{{mpv}}", f(formData.mpv))
        .replace("{{pdw}}", f(formData.pdw))
        .replace("{{p_lcr}}", f(formData.p_lcr))
        .replace("{{p_lcc}}", f(formData.p_lcc))
    } catch (error) {
      Logger.logError(new Error(`Hemogram-palenque template processing error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Processes templates that include test results with photo evidence
   * Handles hemoparasites and distemper test types
   */
  static async processTestWithPhotoTemplate(htmlContent, formData, testType) {
    try {
      // Compress and process the test photo
      const compressedBase64 = await ImageProcessor.compressBase64Image(formData.testFoto);

      // Apply test-specific template logic
      if (testType === "hemoparasites") {
        return htmlContent
          .replace("{{gusanoCorazon}}", this.formatTestResult(formData.gusanoCorazon))
          .replace("{{ehrlichiosis}}", this.formatTestResult(formData.ehrlichiosis))
          .replace("{{lyme}}", this.formatTestResult(formData.lyme))
          .replace("{{anaplasmosis}}", this.formatTestResult(formData.anaplasmosis))
          .replace("{{testFoto}}", compressedBase64);
      } else if (testType === "distemper") {
        return htmlContent
          .replace("{{distemper}}", this.formatTestResult(formData.distemper))
          .replace("{{adenovirus}}", this.formatTestResult(formData.adenovirus))
          .replace("{{testFoto}}", compressedBase64);
      }

      throw new Error(`Unknown test type: ${testType}`);
    } catch (error) {
      Logger.logError(new Error(`Test template processing error: ${error.message}`));
      throw error;
    }
  }

  /**
   * Formats test results with appropriate styling based on result value
   */
  static formatTestResult(result) {
    return result === "Positivo"
      ? '<span class="bold is-positive">Positivo</span>'
      : '<span class="bold">Negativo</span>';
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
   * @param {string} formType - Type of form (hemogram, hemoparasites, distemper)
   * @returns {string} - Path to the generated PDF file
   */
  static async generatePDF(formData, outputPath, formType) {
    let browser;

    try {
      // Select and load appropriate template
      const templatePath = path.join(CONFIG.templateDir, `${formType}Template.html`);
      let htmlContent = fs.readFileSync(templatePath, "utf8");

      // Process common template elements
      htmlContent = await TemplateProcessor.processBaseTemplate(htmlContent, formData);

      // Apply form-specific processing
      switch (formType) {
        case "hemogram":
          htmlContent = TemplateProcessor.processHemogramTemplate(htmlContent, formData);
          break;
        case "hemogram_palenque":
          htmlContent = TemplateProcessor.processHemogram_PalenqueTemplate(htmlContent, formData);
          break;
        case "hemoparasites":
          htmlContent = await TemplateProcessor.processTestWithPhotoTemplate(
            htmlContent,
            formData,
            "hemoparasites",
          );
          break;
        case "distemper":
          htmlContent = await TemplateProcessor.processTestWithPhotoTemplate(
            htmlContent,
            formData,
            "distemper",
          );
          break;
        default:
          throw new Error(`Unknown form type: ${formType}`);
      }

      // Render HTML to PDF
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
      // Ensure browser is closed even if an error occurs
      if (browser) {
        await browser.close().catch((err) => {
          Logger.logError(new Error(`Browser close error: ${err.message}`));
        });
      }
    }
  }
}

module.exports = { generatePDF: PDFGenerator.generatePDF };
