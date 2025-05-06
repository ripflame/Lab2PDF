module.exports = {
  id: "hemograma_zoovet_canino",
  formFile: "hemogram_palenque.html",
  templateFile: "hemogram_palenqueTemplate.html",
  type: "table",
  fields: [
    {
      id: 'eritrocitos',
      templateField: 'eritrocitos',
      label: 'Eritrocitos',
      min: '5500000', 
      max: '8500000', 
      unit: 'x mm<sup>3</sup>'
    },
    {
      id: 'hemoglobina',
      templateField: 'hemoglobina',
      label: 'Hemoglobina',
      min: '12.0', 
      max: '18.0', 
      unit: 'g/dL'
    },
    {
      id: 'hematocrito',
      templateField: 'hematocrito',
      label: 'Hematocrito',
      min: '37.0', 
      max: '55.0', 
      unit: '%'
    },
    {
      id: 'vgm',
      templateField: 'vgm',
      label: 'Volumen Globular Medio',
      min: '60.0', 
      max: '77.0', 
      unit: 'fL'
    },
    {
      id: 'hpe',
      templateField: 'hpe',
      label: 'Hemoglobina Promedio por Eritrocitos',
      min: '19.5', 
      max: '24.5', 
      unit: 'pg'
    },
    {
      id: 'cmh',
      templateField: 'cmh',
      label: 'Concentración Media de Hemoglobina',
      min: '32.0', 
      max: '36.0', 
      unit: 'g/dL'
    },
    {
      id: 'plaquetas',
      templateField: 'plaquetas',
      label: 'Plaquetas',
      min: '200000', 
      max: '500000', 
      unit: 'x mm<sup>3</sup>'
    },
    {
      id: 'leucocitos',
      templateField: 'leucocitos',
      label: 'Leucocitos',
      min: '6000', 
      max: '17000', 
      unit: 'mm<sup>3</sup>'
    },
    {
      id: 'monocitos_rel',
      templateField: 'monocitos_rel',
      label: 'Monocitos',
      min: '3', 
      max: '10', 
      unit: '%'
    },
    {
      id: 'linfocitos_rel',
      templateField: 'linfocitos_rel',
      label: 'Linfocitos',
      min: '13', 
      max: '15', 
      unit: '%'
    },
    {
      id: 'eosinofilos_rel',
      templateField: 'eosinofilos_rel',
      label: 'Eosinófilos',
      min: '2', 
      max: '10', 
      unit: '%'
    },
    {
      id: 'basofilos_rel',
      templateField: 'basofilos_rel',
      label: 'Basófilos',
      min: '0', 
      max: '1', 
      unit: '%'
    },
    {
      id: 'neutrofilos_segmentados_rel',
      templateField: 'neutrofilos_segmentados_rel',
      label: 'Neutrófilos Segmentados',
      min: '60', 
      max: '77', 
      unit: '%'
    },
    {
      id: 'neutrofilos_banda_rel',
      templateField: 'neutrofilos_banda_rel',
      label: 'Neutrófilos en Banda',
      min: '0', 
      max: '3', 
      unit: '%'
    },
    {
      id: 'monocitos_abs',
      templateField: 'monocitos_abs',
      label: 'Monocitos',
      min: '150', 
      max: '1350', 
      unit: 'x mm<sup>3</sup>'
    },
    {
      id: 'linfocitos_abs',
      templateField: 'linfocitos_abs',
      label: 'Linfocitos',
      min: '1000', 
      max: '5000', 
      unit: 'x mm<sup>3</sup>'
    },
    {
      id: 'eosinofilos_abs',
      templateField: 'eosinofilos_abs',
      label: 'Eosinófilos',
      min: '100', 
      max: '1000', 
      unit: 'x mm<sup>3</sup>'
    },
    {
      id: 'basofilos_abs',
      templateField: 'basofilos_abs',
      label: 'Basófilos',
      min: '0', 
      max: '100', 
      unit: 'x mm<sup>3</sup>'
    },
    {
      id: 'neutrofilos_segmentados_abs',
      templateField: 'neutrofilos_segmentados_abs',
      label: 'Neutrófilos Segmentados',
      min: '3000', 
      max: '11500', 
      unit: 'x mm<sup>3</sup>'
    },
    {
      id: 'neutrofilos_banda_abs',
      templateField: 'neutrofilos_banda_abs',
      label: 'Neutrófilos en Banda',
      min: '0', 
      max: '300', 
      unit: 'x mm<sup>3</sup>'
    },
  ]
};
