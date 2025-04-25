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

  it("should generate a PDF file for hemogram", async function () {
    const formData = {
      requerido: "Veterinaria CaNinna",
      nombrePropietario: "Juan Pérez",
      telefono: "1234567890",
      nombreMascota: "Fido",
      especie: "Canino",
      raza: "Labrador",
      edad: "5",
      sexo: "Macho",
      fecha: "2023-10-01",
      eritrocitos: "7240000",
      hemoglobina: "17.8",
      hematocrito: "54.5",
      vgm: "75.2",
      hpe: "24.6",
      cmh: "32.7",
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

    const pdfPath = path.join(outputDir, `${formData.nombreMascota}_InformeLaboratorio.pdf`);

    await generatePDF(formData, pdfPath, "labrios_hemograma_canino");

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), "PDF file was not created");
  });

  it("should generate a PDF file for hemoparasites", async function () {
    const imgPath = path.join(__dirname, "test_assets", "hemoparasitos.jpg");
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
      sexo: "Macho",
      fecha: "2023-10-01",
      gusanoCorazon: "Negativo",
      ehrlichiosis: "Positivo",
      lyme: "Negativo",
      anaplasmosis: "Negativo",
      testFoto: base64Img,
    };

    const pdfPath = path.join(outputDir, `${formData.nombreMascota}_InformeHemoparasitos.pdf`);

    await generatePDF(formData, pdfPath, "hemoparasites");

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), "PDF file was not created");
  });

  it("should generate a PDF file for distemper/adenovirus", async function () {
    const imgPath = path.join(__dirname, "test_assets", "distemper.png");
    const imgBuffer = fs.readFileSync(imgPath);
    const base64Img = `data:image/jpeg;base64,${imgBuffer.toString("base64")}`;

    const formData = {
      requerido: "Veterinaria CaNinna",
      nombrePropietario: "Juan Pérez",
      telefono: "1234567890",
      nombreMascota: "Bolita",
      especie: "Canino",
      raza: "French",
      edad: "19",
      sexo: "Macho",
      fecha: "2023-10-01",
      distemper: "Negativo",
      adenovirus: "Positivo",
      testFoto: base64Img,
    };

    const pdfPath = path.join(
      outputDir,
      `${formData.nombreMascota}_InformeDistemperAdenovirus.pdf`,
    );

    await generatePDF(formData, pdfPath, "distemper");

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), "PDF file was not created");
  });

  it("should generate a PDF file for hemogram palenque", async function () {
    const formData = {
      requerido: "Veterinaria CaNinna",
      nombrePropietario: "Juan Pérez",
      telefono: "1234567890",
      nombreMascota: "Fido",
      especie: "Canino",
      raza: "Labrador",
      edad: "5",
      sexo: "Macho",
      fecha: "2023-10-01",
      rbc: "7240000",
      hgb: "17.8",
      hct: "54.5",
      mcv: "75.2",
      mch: "24.6",
      mchc: "32.7",
      rdw_cv: "0.00",
      rdw_sd: "0.00",
      plt: "339000",
      pct: "0.00",
      mpv: "0.00",
      pdw: "0.00",
      p_lcr: "0.00",
      p_lcc: "0.00",
      leucocitos: "14400",
      monocitos_rel: "0",
      granulocitos_rel: "0",
      linfocitos_rel: "44",
      eosinofilos_rel: "18",
      monocitos_abs: "0",
      granulocitos_abs: "0",
      linfocitos_abs: "6336",
      eosinofilos_abs: "2592",
    };

    const pdfPath = path.join(
      outputDir,
      `${formData.nombreMascota}_InformeLaboratorioPalenque.pdf`,
    );

    await generatePDF(formData, pdfPath, "hemogram_palenque");

    // Check if the PDF file was created
    assert(fs.existsSync(pdfPath), "PDF file was not created");
  });
});
