module.exports = {
  id: "hemograma_caninna",
  formFile: "hemogram_caninna.html",
  templateFile: "hemogramTemplate_caninna.html",
  type: "table",
  fields: [
    {
      id: "eritrocitos",
      templateField: "eritrocitos",
      label: "Eritrocitos",
      min: "5.60",
      max: "12.60",
      unit: "x 10<sup>12</sup>/L"
    },
    {
      id: "hemoglobina",
      templateField: "hemoglobina",
      label: "Hemoglobina",
      min: "98.00",
      max: "178.00",
      unit: "g/L"
    },
    {
      id: "hematocrito",
      templateField: "hematocrito",
      label: "Hematocrito",
      min: "26.00",
      max: "47.00",
      unit: "%"
    },
    {
      id: "vgm",
      templateField: "vgm",
      label: "Volumen Globular Medio",
      min: "38.70",
      max: "52.50",
      unit: "fL"
    },
    {
      id: "hpe",
      templateField: "hpe",
      label: "Hemoglobina Promedio por Eritrocitos",
      min: "11.80",
      max: "16.50",
      unit: "pg"
    },
    {
      id: "cmh",
      templateField: "cmh",
      label: "Concentración Media de Hemoglobina",
      min: "280.0",
      max: "380.0",
      unit: "g/dL"
    },
    {
      id: "plaquetas",
      templateField: "plaquetas",
      label: "Plaquetas",
      min: "140.00",
      max: "547.00",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "leucocitos",
      templateField: "leucocitos",
      label: "Leucocitos",
      min: "3.50",
      max: "17.90",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "monocitos_rel",
      templateField: "monocitos_rel",
      label: "Monocitos",
      min: "1.00",
      max: "7.20",
      unit: "%"
    },
    {
      id: "linfocitos_rel",
      templateField: "linfocitos_rel",
      label: "Linfocitos",
      min: "20.00",
      max: "50.00",
      unit: "%"
    },
    {
      id: "eosinofilos_rel",
      templateField: "eosinofilos_rel",
      label: "Eosinófilos",
      min: "1.00",
      max: "11.20",
      unit: "%"
    },
    {
      id: "basofilos_rel",
      templateField: "basofilos_rel",
      label: "Basófilos",
      min: "0.00",
      max: "0.20",
      unit: "%"
    },
    {
      id: "neutrofilos_segmentados_rel",
      templateField: "neutrofilos_segmentados_rel",
      label: "Neutrófilos Segmentados",
      min: "38.00",
      max: "80.00",
      unit: "%"
    },
    {
      id: "neutrofilos_banda_rel",
      templateField: "neutrofilos_banda_rel",
      label: "Neutrófilos en Banda",
      min: "0.00",
      max: "10.00",
      unit: "%"
    },
    {
      id: "monocitos_abs",
      templateField: "monocitos_abs",
      label: "Monocitos",
      min: "0.00",
      max: "0.90",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "linfocitos_abs",
      templateField: "linfocitos_abs",
      label: "Linfocitos",
      min: "0.73",
      max: "6.60",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "eosinofilos_abs",
      templateField: "eosinofilos_abs",
      label: "Eosinófilos",
      min: "0.00",
      max: "1.20",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "basofilos_abs",
      templateField: "basofilos_abs",
      label: "Basófilos",
      min: "0.00",
      max: "0.12",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "neutrofilos_segmentados_abs",
      templateField: "neutrofilos_segmentados_abs",
      label: "Neutrófilos Segmentados",
      min: "2.30",
      max: "12.58",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "neutrofilos_banda_abs",
      templateField: "neutrofilos_banda_abs",
      label: "Neutrófilos en Banda",
      min: "0.00",
      max: "0.80",
      unit: "x 10<sup>9</sup>/L"
    },
  ]
};
