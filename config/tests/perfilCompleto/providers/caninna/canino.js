module.exports = {
  id: "perfilCompleto_caninna",
  formFile: "perfilcompleto_caninna_canino.html",
  templateFile: "perfilcompleto_caninna_canino_template.html",
  type: "table",

  meta: {
    title: "Perfil Bioquímico Completo",
    headerTitle: ["Resultados de laboratorio", "Perfil Bioquímico Completo"],
    formTitle: "RESULTADOS DE LABORATORIO<br />PERFIL BIOQUÍMICO COMPLETO",
    method: "Analizador bioquímico SKYLA VB1 de química seca en sangre, plasma o suero, semiautomático con discos reactivos de biomarcadores"
  },

  sections: [
    {
      title: "Perfil Bioquímico",
      fields: ["alb", "tp", "glu", "chol", "alp", "alt", "ggt", "tbil", "amy", "lipa", "bun", "crea", "ca", "phos", "glob", "urea", "ag", "bc"]
    }
  ],

  fields: [
    {
      id: 'alb',
      templateField: 'alb',
      label: 'Albúmina (ALB)',
      min: '2.6', 
      max: '4.6', 
      unit: 'g/dL'
    },
    {
      id: 'tp',
      templateField: 'tp',
      label: 'Proteínas Totales (TP)',
      min: '5.2', 
      max: '8.2', 
      unit: 'g/dL'
    },
    {
      id: 'glu',
      templateField: 'glu',
      label: 'Glucosa (GLU)',
      min: '60', 
      max: '132', 
      unit: 'mg/dL'
    },
    {
      id: 'chol',
      templateField: 'chol',
      label: 'Colesterol Total (CHOL)',
      min: '110', 
      max: '320', 
      unit: 'mg/dL'
    },
    {
      id: 'alp',
      templateField: 'alp',
      label: 'Fosfatasa Alcalina (ALP)',
      min: '0', 
      max: '212', 
      unit: 'U/L'
    },
    {
      id: 'alt',
      templateField: 'alt',
      label: 'Alanina Aminotran (ALT)',
      min: '0', 
      max: '88', 
      unit: 'U/L'
    },
    {
      id: 'ggt',
      templateField: 'ggt',
      label: 'Transpeptidasa (GGT)',
      min: '0', 
      max: '10', 
      unit: 'U/L'
    },
    {
      id: 'tbil',
      templateField: 'tbil',
      label: 'Bilirrubina Total (TBIL)',
      min: '0.0', 
      max: '0.9', 
      unit: 'mg/dL'
    },
    {
      id: 'amy',
      templateField: 'amy',
      label: 'Amilasa (AMY)',
      min: '400', 
      max: '1500', 
      unit: 'U/L'
    },
    {
      id: 'lipa',
      templateField: 'lipa',
      label: 'Lipasa (LIPA)',
      min: '0', 
      max: '125', 
      unit: 'U/L'
    },
    {
      id: 'bun',
      templateField: 'bun',
      label: 'Nitrógeno Uréico (BUN)',
      min: '6.0', 
      max: '26.0', 
      unit: 'mg/dL'
    },
    {
      id: 'crea',
      templateField: 'crea',
      label: 'Creatinina (CREA)',
      min: '0.40', 
      max: '1.60', 
      unit: 'mg/dL'
    },
    {
      id: 'ca',
      templateField: 'ca',
      label: 'Calcio (CA)',
      min: '7.9', 
      max: '12.0', 
      unit: 'mg/dL'
    },
    {
      id: 'phos',
      templateField: 'phos',
      label: 'Fósforo (PHOS)',
      min: '2.5', 
      max: '6.8', 
      unit: 'mg/dL'
    },
    {
      id: 'glob',
      templateField: 'glob',
      label: 'Globulina (#GLOB)',
      min: '2.2', 
      max: '4.6', 
      unit: 'g/dL'
    },
    {
      id: 'urea',
      templateField: 'urea',
      label: 'Urea (#UREA)',
      min: '12.8', 
      max: '55.6', 
      unit: 'mg/dL'
    },
    {
      id: 'ag',
      templateField: 'ag',
      label: 'Relación Albúmina/Globulina (#A/G)',
      min: '', 
      max: '', 
      unit: ''
    },
    {
      id: 'bc',
      templateField: 'bc',
      label: 'Relación Nitrógeno Uréico/Creatinina (#B/C)',
      min: '', 
      max: '', 
      unit: ''
    },
  ]
};
