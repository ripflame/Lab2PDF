module.exports = {
  id: "distemper_caninna",
  formFile: "distemper_caninna_canino.html",
  templateFile: "distemper_caninna_canino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rápida de distemper/adenovirus",
    headerTitle: ["Certificado de prueba rápida", "distemper/adenovirus canino"],
    formTitle: "RESULTADOS DE LABORATORIO<br>DISTEMPER/ADENOVIRUS CANINO",
    legendTitle: "Distemper/Adenovirus",
    testDescription: "El análisis mediante inmunoensayo cromatográfico revela los siguientes hallazgos en el paciente:",
    validation: {
      name: "MVZ Laura Cabrera Borromeo",
      cedula: "11681000",
      org: "COMVEPET",
      memberId: "2020-016"
    },
    additionalStudiesNote: "Nota: Esta es una prueba rapida de tamizaje. Para confirmar el diagnostico se recomienda realizar estudios complementarios como: hemograma completo y perfil bioquimico."
  },

  fields: [
    {
      id: "distemper",
      label: "Distemper Canino",
    },
    {
      id: "adenovirus",
      label: "Adenovirus Canino",
    },
  ]
};
