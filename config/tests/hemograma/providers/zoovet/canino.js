module.exports = {
  id: "hemograma_zoovet",
  formFile: "hemogram_palenque.html",
  templateFile: "hemogram_palenqueTemplate.html",
  type: "table",
  fields: [
    {
      id: 'wbc',
      templateField: 'wbc',
      label: 'Leucocitos Totales (WBC)',
      min: '6.0', 
      max: '17.0', 
      unit: '10<sup>9</sup>/L'
    },
    {
      id: 'linfocitos_abs',
      templateField: 'linfocitos_abs',
      label: 'Linfocitos (LYM #)',
      min: '1.0', 
      max: '4.8', 
      unit: '10<sup>9</sup>/L'
    },
    {
      id: 'monocitos_abs',
      templateField: 'monocitos_abs',
      label: 'Monocitos (MON #)',
      min: '0.15', 
      max: '1.35', 
      unit: '10<sup>9</sup>/L'
    },
    {
      id: 'granulocitos_abs',
      templateField: 'granulocitos_abs',
      label: 'Granulocitos (GRA #)',
      min: '3.62', 
      max: '11.5', 
      unit: '10<sup>9</sup>/L'
    },
    {
      id: 'eosinofilos_abs',
      templateField: 'eosinofilos_abs',
      label: 'Eosinófilos (EOS #)',
      min: '0.1', 
      max: '1.25', 
      unit: '10<sup>9</sup>/L'
    },
    {
      id: 'linfocitos_rel',
      templateField: 'linfocitos_rel',
      label: 'Linfocitos (LYM %)',
      min: '12.00', 
      max: '33.00', 
      unit: '%'
    },
    {
      id: 'monocitos_rel',
      templateField: 'monocitos_rel',
      label: 'Monocitos (MON %)',
      min: '2.00', 
      max: '13.00', 
      unit: '%'
    },
    {
      id: 'granulocitos_rel',
      templateField: 'granulocitos_rel',
      label: 'Granulocitos (GRA %)',
      min: '52.00', 
      max: '81.00', 
      unit: '%'
    },
    {
      id: 'eosinofilos_rel',
      templateField: 'eosinofilos_rel',
      label: 'Eosinófilos (EOS %)',
      min: '0.50', 
      max: '10.00', 
      unit: '%'
    },
    {
      id: 'rbc',
      templateField: 'rbc',
      label: 'Eritrocitos (RBC)',
      min: '5.10', 
      max: '8.50', 
      unit: '10<sup>9</sup>/L'
    },
    {
      id: 'hgb',
      templateField: 'hgb',
      label: 'Hemoglobina (HGB)',
      min: '11.00', 
      max: '19.00', 
      unit: 'g/dL'
    },
    {
      id: 'hct',
      templateField: 'hct',
      label: 'Hematocrito (HCT)',
      min: '33.00', 
      max: '56.00', 
      unit: '%'
    },
    {
      id: 'mcv',
      templateField: 'mcv',
      label: 'Volumen Corpuscular Medio',
      min: '60.00', 
      max: '76.00', 
      unit: 'fL'
    },
    {
      id: 'mch',
      templateField: 'mch',
      label: 'Hemoglobina Corpuscular Media (MCH)',
      min: '20.00', 
      max: '27.00', 
      unit: 'pg'
    },
    {
      id: 'mchc',
      templateField: 'mchc',
      label: 'Concentración de Hemoglobina Corpuscular Media (MCHC)',
      min: '30.00', 
      max: '38.00', 
      unit: 'fL'
    },
    {
      id: 'rdw_cv',
      templateField: 'rdw_cv',
      label: 'Amplitud de Distribución Eritrocitaria (RDW_CV)',
      min: '12.50', 
      max: '17.20', 
      unit: 'fL'
    },
    {
      id: 'rdw_sd',
      templateField: 'rdw_sd',
      label: 'Desviación de Distribución Eritrocitaria (RDW_SD)',
      min: '33.20', 
      max: '46.30', 
      unit: 'fL'
    },
    {
      id: 'plt',
      templateField: 'plt',
      label: 'Plaquetas (PLT)',
      min: '200', 
      max: '500', 
      unit: '10<sup>9</sup>/L'
    },
    {
      id: 'pct',
      templateField: 'pct',
      label: 'Procalcitonina',
      min: '0.09', 
      max: '0.58', 
      unit: '%'
    },
    {
      id: 'mpv',
      templateField: 'mpv',
      label: 'Volumen Plaquetario',
      min: '8.00', 
      max: '17.10', 
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
      unit: '10<sup>9</sup>/L'
    },
  ]
};
