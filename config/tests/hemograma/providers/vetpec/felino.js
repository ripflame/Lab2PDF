module.exports = {
  id: "hemograma_vetpec",
  formFile: "hemograma_vetpec_felino.html",
  templateFile: "hemograma_vetpec_felino_template.html",
  type: "table",

  meta: {
    title: "Hemograma completo",
    headerTitle: ["Resultados de laboratorio", "Hemograma completo"],
    formTitle: "RESULTADOS DE LABORATORIO<br />HEMOGRAMA COMPLETO",
    maquilado: "Veterinaria PEC. Prol. Aldama esq. Revolucion, col. Unitaria. Perif. sur a 200mts. Tel: (916) 590-6418"
  },

  sections: [
    {
      title: "Formula Roja",
      fields: ["eri", "hb", "hct", "vcm", "hcm", "chcm", "rdwc", "rdws", "plt", "vpm", "pct", "pdwc", "pdws"]
    },
    {
      title: "Formula Blanca - Valores Absolutos",
      fields: ["leu_abs", "lym_abs", "mon_abs", "neu_abs", "eos_abs", "bas_abs"]
    },
    {
      title: "Valores Relativos",
      fields: ["lym_rel", "mon_rel", "neu_rel", "eos_rel", "bas_rel"]
    }
  ],

  fields: [
    {
      id: 'leu_abs',
      templateField: 'leu_abs',
      label: 'Leucocitos Absolutos (LEU)',
      min: '3.50', 
      max: '20.70', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'lym_abs',
      templateField: 'lym_abs',
      label: 'Linfocitos Absolutos (LIN)',
      min: '0.83', 
      max: '9.10', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'mon_abs',
      templateField: 'mon_abs',
      label: 'Monocitos Absolutos (MON)',
      min: '0.09', 
      max: '1.21', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'neu_abs',
      templateField: 'neu_abs',
      label: 'Neutrófilos Absolutos (NEU)',
      min: '1.63', 
      max: '13.37', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'eos_abs',
      templateField: 'eos_abs',
      label: 'Eosinófilos Absolutos (EOS)',
      min: '0.02', 
      max: '0.49', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'bas_abs',
      templateField: 'bas_abs',
      label: 'Basófilos Absolutos (BAS)',
      min: '0.00', 
      max: '0.20', 
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
      min: '7.70', 
      max: '12.80', 
      unit: 'x 10<sup>12</sup>/l'
    },
    {
      id: 'hb',
      templateField: 'hb',
      label: 'Hemoglobina (Hb)',
      min: '10.00', 
      max: '17.00', 
      unit: 'g/dl'
    },
    {
      id: 'hct',
      templateField: 'hct',
      label: 'Hematocrito (HCT)',
      min: '33.70', 
      max: '55.40', 
      unit: '%'
    },
    {
      id: 'vcm',
      templateField: 'vcm',
      label: 'Volumen Corpuscural Medio (VCM)',
      min: '35.00', 
      max: '52.00', 
      unit: 'fl'
    },
    {
      id: 'hcm',
      templateField: 'hcm',
      label: 'Hemoglobina Corpuscural Media (HCM)',
      min: '10.00', 
      max: '16.90', 
      unit: 'pg'
    },
    {
      id: 'chcm',
      templateField: 'chcm',
      label: 'Concentración Hemoglobina Corpuscural Media (CHCM)',
      min: '27.00', 
      max: '35.00', 
      unit: 'g/dl'
    },
    {
      id: 'rdwc',
      templateField: 'rdwc',
      label: 'Dispersión de glóbulos rojos (RDWc)',
      min: '18.30', 
      max: '24.10', 
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
      min: '125.00', 
      max: '618.00', 
      unit: 'x 10<sup>9</sup>/l'
    },
    {
      id: 'vpm',
      templateField: 'vpm',
      label: 'Volumen Plaquetario Medio (VPM)',
      min: '8.60', 
      max: '14.90', 
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
