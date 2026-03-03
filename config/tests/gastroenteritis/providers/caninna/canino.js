module.exports = {
  id: "gastroenteritis_caninna",
  formFile: "gastroenteritis_caninna_canino.html",
  templateFile: "gastroenteritis_caninna_canino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rápida de gastroenteritis",
    headerTitle: ["Certificado de prueba rápida", "gastroenteritis"],
    formTitle: "RESULTADOS DE LABORATORIO<br>GASTROENTERITIS",
    legendTitle: "Gastroenteritis",
    testDescription: "El análisis mediante inmunoensayo cromatográfico revela los siguientes hallazgos en el paciente:",
    validation: {
      name: "MVZ Laura Cabrera Borromeo",
      cedula: "11681000",
      org: "COMVEPET",
      memberId: "2020-016"
    },
    additionalStudiesNote: "Nota: Esta es una prueba rapida de tamizaje. Para confirmar el diagnostico se recomienda realizar estudios complementarios como: coproparasitoscopico, hemograma completo y perfil bioquimico."
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
