// Handle PDF Generation Response
window.electron.onPDFGenerado((rutaPDF) => {
  const button = document.getElementById("generarPDFButton");
  button.disabled = false;
  button.innerHTML = "Generar PDF";

  if (!rutaPDF) {
    console.warn("PDF generation was canceled.");
    return;
  }

  toggleVisibility(["resultadoPDF"], true);
  document.getElementById("abrirUbicacionPDF").setAttribute("data-pdf-path", rutaPDF);
});
