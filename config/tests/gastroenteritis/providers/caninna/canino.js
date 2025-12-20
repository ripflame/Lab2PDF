module.exports = {
  id: "gastroenteritis_caninna",
  formFile: "gastroenteritis_caninna_canino.html",
  templateFile: "gastroenteritis_caninna_canino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rapida de gastroenteritis",
    headerTitle: ["Certificado de prueba rapida", "gastroenteritis"],
    formTitle: "RESULTADOS DE LABORATORIO<br>GASTROENTERITIS",
    legendTitle: "Gastroenteritis",
    testDescription: "El analisis mediante inmunoensayo cromatografico revela los siguientes hallazgos en el paciente:",
    validation: {
      name: "MVZ Laura Cabrera Borromeo",
      cedula: "11681000",
      org: "COMVEPET",
      memberId: "2020-016"
    }
  },

  fields: [
    {
      id: "parvovirus",
      label: "Parvovirus",
    },
    {
      id: "coronavirus",
      label: "Coronavirus",
    },
    {
      id: "giardiasis",
      label: "Giardiasis",
    },
  ]
};
