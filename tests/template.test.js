const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { generatePDF } = require("../utils/pdfGenerator");

describe("PDF Generation", function () {
  this.timeout(10000); // Increase timeout for PDF generation

  const outputDir = path.join(__dirname, "test_output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  it("should generate a PDF file", async function () {
    const formData = {
      requerido: "Veterinaria CaNinna",
      nombrePropietario: "Juan Pérez",
      telefono: "1234567890",
      nombreMascota: "Fido",
      especie: "Canino",
      raza: "Labrador",
      edad: "5",
      sexo: "macho",
      fecha: "2023-10-01",
      eritrocitos: "7240000",
      hemoglobina: "17.8",
      hematocrito: "54.5",
      volumenGlobularMedio: "75.2",
      hemoglobinaPromedio: "24.6",
      concentracionMediaHemoglobina: "32.7",
      plaquetas: "339000",
      leucocitos: "14400",
      monocitos_rel: "0",
      linfocitos_rel: "44",
      eosinofilos_rel: "18",
      basofilos_rel: "0",
      neutrofilos_segmentados_rel: "38",
      neutrofilos_banda_rel: "0",
      monocitos_abs: "0",
      linfocitos_abs: "6336",
      eosinofilos_abs: "2592",
      basofilos_abs: "0",
      neutrofilos_segmentados_abs: "5472",
      neutrofilos_banda_abs: "0",
    };

    const pdfPath = path.join(
      outputDir,
      `${formData.nombreMascota}_InformeLaboratorio.pdf`,
    );

    await generatePDF(formData, pdfPath, "hemogram");

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), "PDF file was not created");
  });

  it("should generate a PDF file for hemoparasites", async function () {
    const imgPath = path.join(__dirname, "test_assets", "test1.jpg");
    const imgBuffer = fs.readFileSync(imgPath);
    const base64Img = `data:image/jpeg;base64,${imgBuffer.toString("base64")}`;

    const formData = {
      requerido: "Veterinaria CaNinna",
      nombrePropietario: "Juan Pérez",
      telefono: "1234567890",
      nombreMascota: "Fido",
      especie: "Canino",
      raza: "Labrador",
      edad: "5",
      sexo: "macho",
      fecha: "2023-10-01",
      gusanoCorazon: "Negativo",
      ehrlichiosis: "Positivo",
      lyme: "Negativo",
      anaplasmosis: "Negativo",
      testFoto: base64Img,
    };

    const pdfPath = path.join(
      outputDir,
      `${formData.nombreMascota}_InformeHemoparasitos.pdf`,
    );

    await generatePDF(formData, pdfPath, "hemoparasites");

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), "PDF file was not created");
  });
});
