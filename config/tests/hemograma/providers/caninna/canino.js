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
      min: "4.50",
      max: "8.50",
      unit: "x 10<sup>12</sup>/L"
    },
    {
      id: "hemoglobina",
      templateField: "hemoglobina",
      label: "Hemoglobina",
      min: "110.00",
      max: "190.00",
      unit: "g/L"
    },
    {
      id: "hematocrito",
      templateField: "hematocrito",
      label: "Hematocrito",
      min: "30.00",
      max: "56.00",
      unit: "%"
    },
    {
      id: "vgm",
      templateField: "vgm",
      label: "Volumen Globular Medio",
      min: "59.00",
      max: "78.00",
      unit: "fL"
    },
    {
      id: "hpe",
      templateField: "hpe",
      label: "Hemoglobina Promedio por Eritrocitos",
      min: "19.00",
      max: "27.00",
      unit: "pg"
    },
    {
      id: "cmh",
      templateField: "cmh",
      label: "Concentración Media de Hemoglobina",
      min: "300.00",
      max: "380.00",
      unit: "g/dL"
    },
    {
      id: "plaquetas",
      templateField: "plaquetas",
      label: "Plaquetas",
      min: "117.00",
      max: "500.00",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "leucocitos",
      templateField: "leucocitos",
      label: "Leucocitos",
      min: "4.30",
      max: "16.50",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "monocitos_rel",
      templateField: "monocitos_rel",
      label: "Monocitos",
      min: "0.00",
      max: "14.70",
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
      min: "0.50",
      max: "13.70",
      unit: "%"
    },
    {
      id: "basofilos_rel",
      templateField: "basofilos_rel",
      label: "Basófilos",
      min: "0.00",
      max: "0.50",
      unit: "%"
    },
    {
      id: "neutrofilos_segmentados_rel",
      templateField: "neutrofilos_segmentados_rel",
      label: "Neutrófilos Segmentados",
      min: "50.00",
      max: "75.00",
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
      max: "1.50",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "linfocitos_abs",
      templateField: "linfocitos_abs",
      label: "Linfocitos",
      min: "0.83",
      max: "4.50",
      unit: "x 10<sup>9</sup>/L"
    },
    {
      id: "eosinofilos_abs",
      templateField: "eosinofilos_abs",
      label: "Eosinófilos",
      min: "0.04",
      max: "1.60",
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
      min: "2.50",
      max: "11.40",
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
