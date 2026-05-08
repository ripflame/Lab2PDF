module.exports = {
  id: "sida_caninna",
  formFile: "sida_caninna_felino.html",
  templateFile: "sida_caninna_felino_template.html",
  type: "testWithPhoto",

  meta: {
    title: "Prueba rápida SIDA | Leucemia | Gusano del corazón",
    headerTitle: ["Certificado de prueba rápida", "SIDA | Leucemia | Gusano del corazón"],
    formTitle: "RESULTADOS DE LABORATORIO<br>SIDA | LEUCEMIA | GUSANO DEL CORAZÓN",
    legendTitle: "SIDA | Leucemia | Gusano del corazón",
    testDescription: "El análisis mediante inmunoensayo cromatográfico revela los siguientes hallazgos en el paciente:",
    validation: {
      name: "MVZ Laura Cabrera Borromeo",
      cedula: "11681000",
      org: "COMVEPET",
      memberId: "2020-016"
    },
    maquilado: "Veterinaria CaNinna. Emiliano Zapata, Tab.: Calle Moctezuma entre Libertad y Vicente Guerrero, Centro. Tel:(934) 113-5079. Palenque, Chis.: Avenida Nicolas Bravo entre Abasolo e Independencia, Centro. Tel:(916) 124-6050.",
    additionalStudiesNote: "Nota: Esta es una prueba rapida de tamizaje. Para confirmar el diagnostico se recomienda realizar estudios complementarios como: PCR y perfil bioquimico."
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
