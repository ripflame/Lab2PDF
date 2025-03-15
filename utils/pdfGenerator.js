const puppeteer = require("puppeteer-core");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { app } = require("electron");

// Function to log errors to a file
function logErrorToFile(error) {
  const logFilePath = path.join(app.getPath("userData"), "error.log");
  const errorMessage = `${new Date().toISOString()} - ${error.stack || error}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
}

// Utility functions
// Function to get the path to the installed Chrome/Chromium browser
function getChromePath() {
  const platform = process.platform;

  if (platform === "win32") {
    // Common Chrome installation paths on Windows
    const chromePaths = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // 64-bit default
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", // 32-bit default
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe", // Edge 64-bit
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", // Edge 32-bit
    ];

    // Check each path
    for (const chromePath of chromePaths) {
      if (fs.existsSync(chromePath)) {
        return chromePath;
      }
    }

    throw new Error(
      "Neither Chrome nor Edge is installed. Please install one of them.",
    );
  } else if (platform === "darwin") {
    // Common Chrome installation paths on macOS
    const chromePaths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // Chrome
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", // Edge
    ];

    // Check each path
    for (const chromePath of chromePaths) {
      if (fs.existsSync(chromePath)) {
        return chromePath;
      }
    }

    throw new Error(
      "Neither Chrome nor Edge is installed. Please install one of them.",
    );
  } else {
    throw new Error("Unsupported platform");
  }
}

function formatNumber(number) {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
}

function formatPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
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
}

// Main function to generate PDF
async function generatePDF(formData, outputPath, formType) {
  let browser; // Declare browser outside the try block

  try {
    const templatePath = path.join(
      __dirname,
      "../templates",
      `${formType}Template.html`,
    );
    const topImagePath = path.join(__dirname, "../templates/img/top.svg");
    const bottomImagePath = path.join(__dirname, "../templates/img/bottom.svg");
    const compressedImagePath = path.join(
      os.tmpdir(),
      `compressed-${Date.now()}.jpg`,
    );

    const topImageContent = fs.readFileSync(topImagePath, "utf8");
    const bottomImageContent = fs.readFileSync(bottomImagePath, "utf8");

    let htmlContent = fs.readFileSync(templatePath, "utf8");

    const [year, month, day] = formData.fecha.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    const formattedAge =
      formData.edad === "1" ? "1 año" : `${formData.edad} años`;

    htmlContent = htmlContent
      .replace("{{requerido}}", formData.requerido)
      .replace("{{fecha}}", formattedDate)
      .replace("{{nombreMascota}}", formData.nombreMascota)
      .replace("{{especie}}", formData.especie)
      .replace("{{raza}}", formData.raza)
      .replace("{{nombrePropietario}}", formData.nombrePropietario)
      .replace("{{edad}}", formData.edad)
      .replace("{{sexo}}", formData.sexo)
      .replace("{{telefono}}", formatPhoneNumber(formData.telefono));

    if (formType === "hemogram") {
      htmlContent = htmlContent
        .replace("{{eritrocitos}}", formatNumber(formData.eritrocitos))
        .replace("{{hemoglobina}}", formatNumber(formData.hemoglobina))
        .replace("{{hematocrito}}", formatNumber(formData.hematocrito))
        .replace("{{vgm}}", formatNumber(formData.volumenGlobularMedio))
        .replace("{{hpe}}", formatNumber(formData.hemoglobinaPromedio))
        .replace(
          "{{cmh}}",
          formatNumber(formData.concentracionMediaHemoglobina),
        )
        .replace("{{plaquetas}}", formatNumber(formData.plaquetas))
        .replace("{{leucocitos}}", formatNumber(formData.leucocitos))
        .replace("{{monocitos_rel}}", formatNumber(formData.monocitos_rel))
        .replace("{{linfocitos_rel}}", formatNumber(formData.linfocitos_rel))
        .replace("{{eosinofilos_rel}}", formatNumber(formData.eosinofilos_rel))
        .replace("{{basofilos_rel}}", formatNumber(formData.basofilos_rel))
        .replace(
          "{{neutrofilos_segmentados_rel}}",
          formatNumber(formData.neutrofilos_segmentados_rel),
        )
        .replace(
          "{{neutrofilos_banda_rel}}",
          formatNumber(formData.neutrofilos_banda_rel),
        )
        .replace("{{monocitos_abs}}", formatNumber(formData.monocitos_abs))
        .replace("{{linfocitos_abs}}", formatNumber(formData.linfocitos_abs))
        .replace("{{eosinofilos_abs}}", formatNumber(formData.eosinofilos_abs))
        .replace("{{basofilos_abs}}", formatNumber(formData.basofilos_abs))
        .replace(
          "{{neutrofilos_segmentados_abs}}",
          formatNumber(formData.neutrofilos_segmentados_abs),
        )
        .replace(
          "{{neutrofilos_banda_abs}}",
          formatNumber(formData.neutrofilos_banda_abs),
        );
    } else if (formType === "hemoparasites") {
      try {
        const compressedBase64 = await compressBase64Image(formData.testFoto);
        htmlContent = htmlContent
          .replace(
            "{{gusanoCorazon}}",
            formData.gusanoCorazon === "Positivo"
              ? '<span class="bold is-positive">Positivo</span>'
              : '<span class="bold">Negativo</span>',
          )
          .replace(
            "{{ehrlichiosis}}",
            formData.ehrlichiosis === "Positivo"
              ? '<span class="bold is-positive">Positivo</span>'
              : '<span class="bold">Negativo</span>',
          )
          .replace(
            "{{lyme}}",
            formData.lyme === "Positivo"
              ? '<span class="bold is-positive">Positivo</span>'
              : '<span class="bold">Negativo</span>',
          )
          .replace(
            "{{anaplasmosis}}",
            formData.anaplasmosis === "Positivo"
              ? '<span class="bold is-positive">Positivo</span>'
              : '<span class="bold">Negativo</span>',
          )
          .replace("{{testFoto}}", compressedBase64);
      } catch (error) {
        logErrorToFile(new Error(`Error compressing image: ${error.message}`));
        throw error;
      }
    } else if (formType === "distemper") {
      try {
        const compressedBase64 = await compressBase64Image(formData.testFoto);
        htmlContent = htmlContent
          .replace(
            "{{distemper}}",
            formData.distemper === "Positivo"
              ? '<span class="bold is-positive">Positivo</span>'
              : '<span class="bold">Negativo</span>',
          )
          .replace(
            "{{adenovirus}}",
            formData.adenovirus === "Positivo"
              ? '<span class="bold is-positive">Positivo</span>'
              : '<span class="bold">Negativo</span>',
          )
          .replace("{{testFoto}}", compressedBase64);
      } catch (error) {
        logErrorToFile(new Error(`Error compressing image: ${error.message}`));
        throw error;
      }
    }

    htmlContent = htmlContent
      .replace(
        "./img/top.svg",
        `data:image/svg+xml;base64,${Buffer.from(topImageContent).toString("base64")}`,
      )
      .replace(
        "./img/bottom.svg",
        `data:image/svg+xml;base64,${Buffer.from(bottomImageContent).toString("base64")}`,
      );

    const chromePath = getChromePath();

    browser = await puppeteer.launch({
      executablePath: chromePath, // Use the pre-installed browser
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "load" });

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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await page.pdf({
      path: outputPath,
      format: "letter",
      printBackground: true,
      margin: {
        top: "0in",
        right: "0in",
        bottom: "0in",
        left: "0in",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    logErrorToFile(
      new Error(`Error in generatePDF function: ${error.message}`),
    ); // Log error to file
    throw error;
  } finally {
    if (browser) {
      // Check if browser is defined before closing
      await browser.close();
    }
  }
}

module.exports = { generatePDF };
