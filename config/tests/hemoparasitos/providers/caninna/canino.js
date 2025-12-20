module.exports = {
  id: "hemoparasitos_caninna",
  formFile: "hemoparasitos_caninna_canino.html",
  templateFile: "hemoparasitos_caninna_canino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rápida de hemoparásitos",
    headerTitle: ["Certificado de prueba rápida", "hemoparásitos"],
    formTitle: "RESULTADOS DE LABORATORIO<br>HEMOPARASITOS",
    legendTitle: "Hemoparásitos",
    testDescription: "El análisis mediante inmunoensayo cromatográfico revela los siguientes hallazgos en el paciente:",
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
