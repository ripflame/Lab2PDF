module.exports = {
  id: "hemograma_bioceli",
  formFile: "hemograma_bioceli_canino.html",
  templateFile: "hemograma_bioceli_canino_template.html",
  type: "table",

  meta: {
    title: "Hemograma completo",
    headerTitle: ["Resultados de laboratorio", "Hemograma completo"],
    formTitle: "RESULTADOS DE LABORATORIO<br />HEMOGRAMA COMPLETO",
    maquilado: "Laboratorio BIO-C-ELI. Av. Nicolas Bravo entre Abasolo e Independencia. Palenque, Chiapas. Tel: (916) 142-1529"
  },

  sections: [
    {
      title: "Fórmula Roja",
      fields: ["eritrocitos", "hemoglobina", "hematocrito", "vgm", "hcm", "cmhc", "plaquetas"]
    },
    {
      title: "Fórmula Blanca",
      fields: [
        "leucocitos_totales",
        {
          title: "Valores Absolutos",
          fields: ["neutrofilos_totales_abs", "neutrofilos_segmentados_abs", "neutrofilos_banda_abs", "eosinofilos_abs", "basofilos_abs", "monocitos_abs", "linfocitos_abs"]
        },
        {
          title: "Valores Relativos",
          fields: ["neutrofilos_totales_rel", "neutrofilos_segmentados_rel", "neutrofilos_banda_rel", "eosinofilos_rel", "basofilos_rel", "monocitos_rel", "linfocitos_rel"]
        }
      ]
    }
  ],

  fields: [
    {
      id: 'eritrocitos',
      templateField: 'eritrocitos',
      label: 'Eritrocitos',
      min: '5.50',
      max: '8.50',
      unit: 'x 10<sup>6</sup>/uL'
    },
    {
      id: 'hemoglobina',
      templateField: 'hemoglobina',
      label: 'Hemoglobina',
      min: '12.00',
      max: '18.00',
      unit: 'g/dL'
    },
    {
      id: 'hematocrito',
      templateField: 'hematocrito',
      label: 'Hematocrito',
      min: '37.00',
      max: '55.00',
      unit: '%'
    },
    {
      id: 'vgm',
      templateField: 'vgm',
      label: 'Volumen Globular Medio',
      min: '60.00',
      max: '77.00',
      unit: 'fL'
    },
    {
      id: 'hcm',
      templateField: 'hcm',
      label: 'HCM',
      min: '19.50',
      max: '24.50',
      unit: 'gr/dL'
    },
    {
      id: 'cmhc',
      templateField: 'cmhc',
      label: 'Concentración Media de Hemoglobina Corpuscular',
      min: '32.00',
      max: '36.00',
      unit: 'gr/dL'
    },
    {
      id: 'plaquetas',
      templateField: 'plaquetas',
      label: 'Plaquetas',
      min: '150',
      max: '500',
      unit: 'x 10<sup>3</sup>/uL'
    },
    {
      id: 'leucocitos_totales',
      templateField: 'leucocitos_totales',
      label: 'Leucocitos Totales Absolutos',
      min: '6000',
      max: '17000',
      unit: 'uL'
    },
    {
      id: 'neutrofilos_totales_abs',
      templateField: 'neutrofilos_totales_abs',
      label: 'Neutrófilos Totales Absolutos',
      min: '3000',
      max: '11500',
      unit: 'uL'
    },
    {
      id: 'neutrofilos_segmentados_abs',
      templateField: 'neutrofilos_segmentados_abs',
      label: 'Neutrófilos Segmentados Absolutos',
      min: '3000',
      max: '11500',
      unit: 'uL'
    },
    {
      id: 'neutrofilos_banda_abs',
      templateField: 'neutrofilos_banda_abs',
      label: 'Neutrófilos en Banda Absolutos',
      min: '0',
      max: '300',
      unit: 'uL'
    },
    {
      id: 'eosinofilos_abs',
      templateField: 'eosinofilos_abs',
      label: 'Eosinófilos Absolutos',
      min: '100',
      max: '1200',
      unit: 'uL'
    },
    {
      id: 'basofilos_abs',
      templateField: 'basofilos_abs',
      label: 'Basófilos Absolutos',
      min: '0',
      max: '100',
      unit: 'uL'
    },
    {
      id: 'monocitos_abs',
      templateField: 'monocitos_abs',
      label: 'Monocitos Absolutos',
      min: '0',
      max: '1200',
      unit: 'uL'
    },
    {
      id: 'linfocitos_abs',
      templateField: 'linfocitos_abs',
      label: 'Linfocitos Absolutos',
      min: '1000',
      max: '5000',
      unit: 'uL'
    },
    {
      id: 'neutrofilos_totales_rel',
      templateField: 'neutrofilos_totales_rel',
      label: 'Neutrófilos Totales Relativos',
      min: '',
      max: '',
      unit: '%'
    },
    {
      id: 'neutrofilos_segmentados_rel',
      templateField: 'neutrofilos_segmentados_rel',
      label: 'Neutrófilos Segmentados Relativos',
      min: '',
      max: '',
      unit: '%'
    },
    {
      id: 'neutrofilos_banda_rel',
      templateField: 'neutrofilos_banda_rel',
      label: 'Neutrófilos en Banda Relativos',
      min: '',
      max: '',
      unit: '%'
    },
    {
      id: 'eosinofilos_rel',
      templateField: 'eosinofilos_rel',
      label: 'Eosinófilos Relativos',
      min: '',
      max: '',
      unit: '%'
    },
    {
      id: 'basofilos_rel',
      templateField: 'basofilos_rel',
      label: 'Basófilos Relativos',
      min: '',
      max: '',
      unit: '%'
    },
    {
      id: 'monocitos_rel',
      templateField: 'monocitos_rel',
      label: 'Monocitos Relativos',
      min: '',
      max: '',
      unit: '%'
    },
    {
      id: 'linfocitos_rel',
      templateField: 'linfocitos_rel',
      label: 'Linfocitos Relativos',
      min: '',
      max: '',
      unit: '%'
    }
  ]
};
