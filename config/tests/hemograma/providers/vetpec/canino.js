module.exports = {
  id: "hemograma_vetpec",
  formFile: "hemograma_vetpec.html",
  templateFile: "hemogramaTemplate_vetpec.html",
  type: "table",
  fields: [
    {
      id: 'leu_abs',
      templateField: 'leu_abs',
      label: 'Leucocitos Absolutos (LEU)',
      min: '6.00', 
      max: '17.00', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'lym_abs',
      templateField: 'lym_abs',
      label: 'Linfocitos Absolutos (LIN)',
      min: '1.00', 
      max: '4.80', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'mon_abs',
      templateField: 'mon_abs',
      label: 'Monocitos Absolutos (MON)',
      min: '0.20', 
      max: '1.50', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'neu_abs',
      templateField: 'neu_abs',
      label: 'Neutrófilos Absolutos (NEU)',
      min: '3.00', 
      max: '12.00', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'eos_abs',
      templateField: 'eos_abs',
      label: 'Eosinófilos Absolutos (EOS)',
      min: '0.00', 
      max: '0.80', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'bas_abs',
      templateField: 'bas_abs',
      label: 'Basófilos Absolutos (BAS)',
      min: '0.00', 
      max: '0.40', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'lym_rel',
      templateField: 'lym_rel',
      label: 'Linfocitos Relativos (LYM%)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'mon_rel',
      templateField: 'mon_rel',
      label: 'Monocitos Relativos (MON%)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'neu_rel',
      templateField: 'neu_rel',
      label: 'Neutrófilos Relativos (NEU%)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'eos_rel',
      templateField: 'eos_rel',
      label: 'Eosinófilos Relativos (EOS%)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'bas_rel',
      templateField: 'bas_rel',
      label: 'Basófilos Relativos (BAS%)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'eri',
      templateField: 'eri',
      label: 'Eritrocitos (ERI)',
      min: '5.50', 
      max: '8.50', 
      unit: 'x 10<sup>12</sup>/l'
    },
    {
      id: 'hb',
      templateField: 'hb',
      label: 'Hemoglobina (Hb)',
      min: '12.0', 
      max: '18.0', 
      unit: 'g/dl'
    },
    {
      id: 'hct',
      templateField: 'hct',
      label: 'Hematocrito (HCT)',
      min: '37.00', 
      max: '55.00', 
      unit: '%'
    },
    {
      id: 'vcm',
      templateField: 'vcm',
      label: 'Volumen Corpuscural Medio (VCM)',
      min: '60', 
      max: '77', 
      unit: 'fl'
    },
    {
      id: 'hcm',
      templateField: 'hcm',
      label: 'Hemoglobina Corpuscural Media (HCM)',
      min: '19.5', 
      max: '24.5', 
      unit: 'pg'
    },
    {
      id: 'chcm',
      templateField: 'chcm',
      label: 'Concentración Hemoglobina Corpuscural Media (CHCM)',
      min: '31.0', 
      max: '39.0', 
      unit: 'g/dl'
    },
    {
      id: 'rdwc',
      templateField: 'rdwc',
      label: 'Dispersión de glóbulos rojos (RDWc)',
      min: '14.0', 
      max: '20.0', 
      unit: '%'
    },
    {
      id: 'rdws',
      templateField: 'rdws',
      label: 'Dispersión de glóbulos rojos (RDWs)',
      min: '', 
      max: '', 
      unit: 'fl'
    },
    {
      id: 'plt',
      templateField: 'plt',
      label: 'Plaquetas (PLT)',
      min: '165', 
      max: '500', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'vpm',
      templateField: 'vpm',
      label: 'Volumen Plaquetario Medio (VPM)',
      min: '3.9', 
      max: '11.1', 
      unit: 'fl'
    },
    {
      id: 'pct',
      templateField: 'pct',
      label: 'Plaquetocrito (PCT)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'pdwc',
      templateField: 'pdwc',
      label: 'Dispersión de plaquetas (PDWc)',
      min: '', 
      max: '', 
      unit: '%'
    },
    {
      id: 'pdws',
      templateField: 'pdws',
      label: 'Disperción de plaquetas (PDWs)',
      min: '', 
      max: '', 
      unit: 'fl'
    },
  ]
};
