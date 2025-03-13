const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { app } = require("electron");

/**
 * Configuration options
 */
const CONFIG = {
  templateDir: path.join(__dirname, "../templates"),
  imageDir: path.join(__dirname, "../templates/img"),
  logPath: path.join(app.getPath("userData"), "error.log"),
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
 * Logger for application errors
 */
class Logger {
  static logError(error) {
    const errorMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
    fs.appendFileSync(CONFIG.logPath, errorMessage);
    console.error(errorMessage);
  }
}

/**
 * Utility functions for data formatting
 */
class Formatters {
  static number(number) {
    return number
      ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "";
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
 * Handles image operations
 */
class ImageProcessor {
  static async compressBase64Image(
    base64String,
    quality = CONFIG.imageCompression.defaultQuality,
  ) {
    try {
      // Extract Base64 data (removing metadata prefix)
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Use sharp to get metadata (detects format automatically)
      const metadata = await sharp(imageBuffer).metadata();

      // Convert to the detected format
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

      // Convert processed image to Base64
      const compressedBuffer = await processedImage.toBuffer();
      const compressedBase64 = `data:image/${metadata.format};base64,${compressedBuffer.toString("base64")}`;

      return compressedBase64;
    } catch (error) {
      Logger.logError(new Error(`Image compression error: ${error.message}`));
      throw error;
    }
  }

  static loadImageAsBase64(imagePath) {
    try {
      const imageContent = fs.readFileSync(imagePath, "utf8");
      return `data:image/svg+xml;base64,${Buffer.from(imageContent).toString("base64")}`;
    } catch (error) {
      Logger.logError(
        new Error(`Failed to load image ${imagePath}: ${error.message}`),
      );
      throw error;
    }
  }
}

/**
 * Browser management for PDF generation
 */
class BrowserManager {
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

    throw new Error(
      "Chrome or Edge browser not found. Please install one of them.",
    );
  }

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

      // Add a small delay to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      Logger.logError(new Error(`Images loading error: ${error.message}`));
      throw error;
    }
  }
}

/**
 * Template processors for different form types
 */
class TemplateProcessor {
  static async processBaseTemplate(htmlContent, formData) {
    try {
      return htmlContent
        .replace("{{requerido}}", formData.requerido)
        .replace("{{fecha}}", Formatters.date(formData.fecha))
        .replace("{{nombreMascota}}", formData.nombreMascota)
        .replace("{{especie}}", formData.especie)
        .replace("{{raza}}", formData.raza)
        .replace("{{nombrePropietario}}", formData.nombrePropietario)
        .replace("{{edad}}", Formatters.age(formData.edad))
        .replace("{{sexo}}", formData.sexo)
        .replace("{{telefono}}", Formatters.phoneNumber(formData.telefono))
        .replace(
          "./img/top.svg",
          ImageProcessor.loadImageAsBase64(
            path.join(CONFIG.imageDir, "top.svg"),
          ),
        )
        .replace(
          "./img/bottom.svg",
          ImageProcessor.loadImageAsBase64(
            path.join(CONFIG.imageDir, "bottom.svg"),
          ),
        );
    } catch (error) {
      Logger.logError(
        new Error(`Base template processing error: ${error.message}`),
      );
      throw error;
    }
  }

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
        .replace(
          "{{neutrofilos_segmentados_rel}}",
          f(formData.neutrofilos_segmentados_rel),
        )
        .replace("{{neutrofilos_banda_rel}}", f(formData.neutrofilos_banda_rel))
        .replace("{{monocitos_abs}}", f(formData.monocitos_abs))
        .replace("{{linfocitos_abs}}", f(formData.linfocitos_abs))
        .replace("{{eosinofilos_abs}}", f(formData.eosinofilos_abs))
        .replace("{{basofilos_abs}}", f(formData.basofilos_abs))
        .replace(
          "{{neutrofilos_segmentados_abs}}",
          f(formData.neutrofilos_segmentados_abs),
        )
        .replace(
          "{{neutrofilos_banda_abs}}",
          f(formData.neutrofilos_banda_abs),
        );
    } catch (error) {
      Logger.logError(
        new Error(`Hemogram template processing error: ${error.message}`),
      );
      throw error;
    }
  }

  static async processTestWithPhotoTemplate(htmlContent, formData, testType) {
    try {
      const compressedBase64 = await ImageProcessor.compressBase64Image(
        formData.testFoto,
      );

      if (testType === "hemoparasites") {
        return htmlContent
          .replace(
            "{{gusanoCorazon}}",
            this.formatTestResult(formData.gusanoCorazon),
          )
          .replace(
            "{{ehrlichiosis}}",
            this.formatTestResult(formData.ehrlichiosis),
          )
          .replace("{{lyme}}", this.formatTestResult(formData.lyme))
          .replace(
            "{{anaplasmosis}}",
            this.formatTestResult(formData.anaplasmosis),
          )
          .replace("{{testFoto}}", compressedBase64);
      } else if (testType === "distemper") {
        return htmlContent
          .replace("{{distemper}}", this.formatTestResult(formData.distemper))
          .replace("{{adenovirus}}", this.formatTestResult(formData.adenovirus))
          .replace("{{testFoto}}", compressedBase64);
      }

      throw new Error(`Unknown test type: ${testType}`);
    } catch (error) {
      Logger.logError(
        new Error(`Test template processing error: ${error.message}`),
      );
      throw error;
    }
  }

  static formatTestResult(result) {
    return result === "Positivo"
      ? '<span class="bold is-positive">Positivo</span>'
      : '<span class="bold">Negativo</span>';
  }
}

/**
 * Main PDF generator class
 */
class PDFGenerator {
  static async generatePDF(formData, outputPath, formType) {
    let browser;

    try {
      // Load template
      const templatePath = path.join(
        CONFIG.templateDir,
        `${formType}Template.html`,
      );
      let htmlContent = fs.readFileSync(templatePath, "utf8");

      // Process base template (common for all form types)
      htmlContent = await TemplateProcessor.processBaseTemplate(
        htmlContent,
        formData,
      );

      // Process form-specific content
      if (formType === "hemogram") {
        htmlContent = TemplateProcessor.processHemogramTemplate(
          htmlContent,
          formData,
        );
      } else if (formType === "hemoparasites") {
        htmlContent = await TemplateProcessor.processTestWithPhotoTemplate(
          htmlContent,
          formData,
          "hemoparasites",
        );
      } else if (formType === "distemper") {
        htmlContent = await TemplateProcessor.processTestWithPhotoTemplate(
          htmlContent,
          formData,
          "distemper",
        );
      } else {
        throw new Error(`Unknown form type: ${formType}`);
      }

      // Create browser and generate PDF
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
          Logger.logError(new Error(`Browser close error: ${err.message}`));
        });
      }
    }
  }
}

module.exports = { generatePDF: PDFGenerator.generatePDF };
