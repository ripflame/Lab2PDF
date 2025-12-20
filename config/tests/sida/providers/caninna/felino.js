module.exports = {
  id: "sida_caninna",
  formFile: "sida_caninna_felino.html",
  templateFile: "sida_caninna_felino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rapida SIDA | Leucemia | Gusano del corazon",
    headerTitle: ["Certificado de prueba rapida", "SIDA | Leucemia | Gusano del corazon"],
    formTitle: "RESULTADOS DE LABORATORIO<br>SIDA | LEUCEMIA | GUSANO DEL CORAZON",
    legendTitle: "SIDA | Leucemia | Gusano del corazon",
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
      id: 'sida',
      templateField: 'sida',
      label: 'SIDA',
    },
    {
      id: "leucemia",
      label: "Leucemia",
    },
    {
      id: "gusano",
      label: "Gusano del Corazón",
    },
  ]
};
