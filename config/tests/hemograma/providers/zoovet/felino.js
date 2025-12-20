module.exports = {
  id: "hemograma_zoovet",
  formFile: "hemograma_zoovet_felino.html",
  templateFile: "hemograma_zoovet_felino_template.html",
  type: "table",

  meta: {
    title: "Hemograma completo",
    headerTitle: ["Resultados de laboratorio", "Hemograma completo"],
    formTitle: "RESULTADOS DE LABORATORIO<br />HEMOGRAMA COMPLETO",
    maquilado: "ZOOVET, Calzada Lazaro Cardenas No. 25, colonia Pakal-Na, Palenque, Chiapas"
  },

  sections: [
    {
      title: "Fórmula Blanca",
      fields: [
        "wbc",
        {
          title: "Valores Absolutos",
          fields: ["linfocitos_abs", "monocitos_abs", "granulocitos_abs", "eosinofilos_abs"]
        },
        {
          title: "Valores Relativos",
          fields: ["linfocitos_rel", "monocitos_rel", "granulocitos_rel", "eosinofilos_rel"]
        }
      ]
    },
    {
      title: "Fórmula Roja",
      fields: ["rbc", "hgb", "hct", "mcv", "mch", "mchc", "rdw_cv", "rdw_sd", "plt", "pct", "mpv", "pdw", "p_lcr", "p_lcc"]
    }
  ],

  fields: [
    {
      id: 'wbc',
      templateField: 'wbc',
      label: 'Leucocitos Totales (WBC)',
      min: '5.50', 
      max: '19.50', 
      unit: 'x 10<sup>9</sup>/L'
    },
    {
      id: 'linfocitos_abs',
      templateField: 'linfocitos_abs',
      label: 'Linfocitos (LYM #)',
      min: '0.73', 
      max: '7.86', 
      unit: 'x 10<sup>9</sup>/L'
    },
    {
      id: 'monocitos_abs',
      templateField: 'monocitos_abs',
      label: 'Monocitos (MON #)',
      min: '0.7', 
      max: '1.36', 
      unit: 'x 10<sup>9</sup>/L'
    },
    {
      id: 'granulocitos_abs',
      templateField: 'granulocitos_abs',
      label: 'Granulocitos (GRA #)',
      min: '3.12', 
      max: '12.58', 
      unit: 'x 10<sup>9</sup>/L'
    },
    {
      id: 'eosinofilos_abs',
      templateField: 'eosinofilos_abs',
      label: 'Eosinófilos (EOS #)',
      min: '0.06', 
      max: '1.93', 
      unit: 'x 10<sup>9</sup>/L'
    },
    {
      id: 'linfocitos_rel',
      templateField: 'linfocitos_rel',
      label: 'Linfocitos (LYM %)',
      min: '12.00', 
      max: '45.00', 
      unit: '%'
    },
    {
      id: 'monocitos_rel',
      templateField: 'monocitos_rel',
      label: 'Monocitos (MON %)',
      min: '1.00', 
      max: '8.00', 
      unit: '%'
    },
    {
      id: 'granulocitos_rel',
      templateField: 'granulocitos_rel',
      label: 'Granulocitos (GRA %)',
      min: '38.00', 
      max: '80.00', 
      unit: '%'
    },
    {
      id: 'eosinofilos_rel',
      templateField: 'eosinofilos_rel',
      label: 'Eosinófilos (EOS %)',
      min: '1.00', 
      max: '11.00', 
      unit: '%'
    },
    {
      id: 'rbc',
      templateField: 'rbc',
      label: 'Eritrocitos (RBC)',
      min: '4.60', 
      max: '10.20', 
      unit: '10<sup>12</sup>/L'
    },
    {
      id: 'hgb',
      templateField: 'hgb',
      label: 'Hemoglobina (HGB)',
      min: '85.00', 
      max: '153.00', 
      unit: 'g/L'
    },
    {
      id: 'hct',
      templateField: 'hct',
      label: 'Hematocrito (HCT)',
      min: '26.00', 
      max: '47.00', 
      unit: '%'
    },
    {
      id: 'mcv',
      templateField: 'mcv',
      label: 'Volumen Corpuscular Medio',
      min: '38.00', 
      max: '54.00', 
      unit: 'fL'
    },
    {
      id: 'mch',
      templateField: 'mch',
      label: 'Hemoglobina Corpuscular Media (MCH)',
      min: '11.80', 
      max: '18.00', 
      unit: 'pg'
    },
    {
      id: 'mchc',
      templateField: 'mchc',
      label: 'Concentración de Hemoglobina Corpuscular Media (MCHC)',
      min: '290.00', 
      max: '360.00', 
      unit: 'g/L'
    },
    {
      id: 'rdw_cv',
      templateField: 'rdw_cv',
      label: 'Amplitud de Distribución Eritrocitaria (RDW_CV)',
      min: '16.00', 
      max: '23.00', 
      unit: 'fL'
    },
    {
      id: 'rdw_sd',
      templateField: 'rdw_sd',
      label: 'Desviación de Distribución Eritrocitaria (RDW_SD)',
      min: '26.40', 
      max: '43.10', 
      unit: 'fL'
    },
    {
      id: 'plt',
      templateField: 'plt',
      label: 'Plaquetas (PLT)',
      min: '100.00', 
      max: '518.00', 
      unit: 'x 10<sup>9</sup>/L'
    },
    {
      id: 'pct',
      templateField: 'pct',
      label: 'Procalcitonina',
      min: '0.09', 
      max: '0.70', 
      unit: '%'
    },
    {
      id: 'mpv',
      templateField: 'mpv',
      label: 'Volumen Plaquetario',
      min: '9.90', 
      max: '16.30', 
      unit: 'fL'
    },
    {
      id: 'pdw',
      templateField: 'pdw',
      label: 'Índice de Distribución Plaquetaria (PDW)',
      min: '12.00', 
      max: '17.50', 
      unit: 'fL'
    },
    {
      id: 'p_lcr',
      templateField: 'p_lcr',
      label: 'Porcentaje de Plaquetas Grandes (P_LCR)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'p_lcc',
      templateField: 'p_lcc',
      label: 'Promedio de Plaquetas (P_LCC)',
      min: '', 
      max: '', 
      unit: 'x 10<sup>9</sup>/L'
    },
  ]
};
