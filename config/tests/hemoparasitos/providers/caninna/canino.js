module.exports = {
  id: "hemoparasitos_caninna",
  formFile: "hemoparasitos_caninna_canino.html",
  templateFile: "hemoparasitos_caninna_canino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rapida de hemoparasitos",
    headerTitle: ["Certificado de prueba rapida", "hemoparasitos"],
    formTitle: "RESULTADOS DE LABORATORIO<br>HEMOPARASITOS",
    legendTitle: "Hemoparasitos",
    testDescription: "El analisis mediante inmunoensayo cromatografico revela los siguientes hallazgos en el paciente:",
    validation: {
      name: "MVZ Laura Cabrera Borromeo",
      cedula: "11681000",
      org: "COMVEPET",
      memberId: "2020-016"
    }
  },

  fields : [
    {
      id: "gusanoCorazon",
      label: "Gusano del Corazón",
    },
    {
      id: "ehrlichiosis",
      label: "Ehrlichiosis",
    },
    {
      id: "lyme",
      label: "Lyme",
    },
    {
      id: "anaplasmosis",
      label: "Anaplasmosis",
    }
  ]
};
