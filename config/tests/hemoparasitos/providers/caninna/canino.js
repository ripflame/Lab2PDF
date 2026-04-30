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
    },
    maquilado: "Veterinaria CaNinna. Emiliano Zapata, Tab.: Calle Moctezuma entre Libertad y Vicente Guerrero, Centro. Tel:(934) 113-5079. Palenque, Chis.: Avenida Nicolas Bravo entre Abasolo e Independencia, Centro. Tel:(916) 124-6050.",
    additionalStudiesNote: "Nota: Esta es una prueba rapida de tamizaje. Para confirmar el diagnostico se recomienda realizar estudios complementarios como: análisis de gota gruesa o hemograma completo con revision de plaquetas."
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
