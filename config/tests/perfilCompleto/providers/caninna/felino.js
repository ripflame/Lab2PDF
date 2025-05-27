module.exports = {
  id: "perfilCompleto_caninna",
  formFile: "perfilCompleto.html",
  templateFile: "perfilCompletoTemplate.html",
  type: "table",
  fields: [
    {
      id: 'alb',
      templateField: 'alb',
      label: 'Albumina (ALB)',
      min: '2.5', 
      max: '4.6', 
      unit: 'g/dL'
    },
    {
      id: 'tp',
      templateField: 'tp',
      label: 'Proteinas Totales (TP)',
      min: '5.7', 
      max: '8.9', 
      unit: 'g/dL'
    },
    {
      id: 'glu',
      templateField: 'glu',
      label: 'Glucosa (GLU)',
      min: '53', 
      max: '150', 
      unit: 'mg/dL'
    },
    {
      id: 'chol',
      templateField: 'chol',
      label: 'Colesterol Total (CHOL)',
      min: '54', 
      max: '220', 
      unit: 'mg/dL'
    },
    {
      id: 'alp',
      templateField: 'alp',
      label: 'Fosfatasa Alcalina (ALP)',
      min: '0', 
      max: '111', 
      unit: 'U/L'
    },
    {
      id: 'alt',
      templateField: 'alt',
      label: 'Alanina Aminotran (ALT)',
      min: '0', 
      max: '116', 
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
      min: '500', 
      max: '1600', 
      unit: 'U/L'
    },
    {
      id: 'lipa',
      templateField: 'lipa',
      label: 'Lipasa (LIPA)',
      min: '0', 
      max: '35', 
      unit: 'U/L'
    },
    {
      id: 'bun',
      templateField: 'bun',
      label: 'Nitrogeno Ureico (BUN)',
      min: '13', 
      max: '37', 
      unit: 'mg/dL'
    },
    {
      id: 'crea',
      templateField: 'crea',
      label: 'Creatinina (CREA)',
      min: '0.7', 
      max: '2.0', 
      unit: 'mg/dL'
    },
    {
      id: 'ca',
      templateField: 'ca',
      label: 'Calcio (CA)',
      min: '8.0', 
      max: '12.0', 
      unit: 'mg/dL'
    },
    {
      id: 'phos',
      templateField: 'phos',
      label: 'Fósforo (PHOS)',
      min: '3.1', 
      max: '7.5', 
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
      label: 'Relación Albumina/Globulina (#A/G)',
      min: '', 
      max: '', 
      unit: ''
    },
    {
      id: 'bc',
      templateField: 'bc',
      label: 'Relación Nitrogeno Uréico/Creatinina (#B/C)',
      min: '', 
      max: '', 
      unit: ''
    },
  ]
};
