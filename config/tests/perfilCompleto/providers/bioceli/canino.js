module.exports = {
  id: "perfilCompleto_bioceli",
  formFile: "perfilcompleto_bioceli_canino.html",
  templateFile: "perfilcompleto_bioceli_canino_template.html",
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
      fields: ["alb", "tgo", "tgp", "fosfatasa_alcalina", "gamma_glutamil", "proteinas_totales", "globulina", "rel_ag", "bilirrubina_total", "bilirrubina_directa", "bilirrubina_indirecta", "dhl", "amilasa", "lipasa", "glucosa", "nitrogeno_ureico", "creatinina", "urea", "acido_urico", "colesterol", "trigliceridos"]
    }
  ],

  fields: [
    {
      id: 'alb',
      templateField: 'alb',
      label: 'Albúmina (ALB)',
      min: '2.6', 
      max: '4.4', 
      unit: 'g/dL'
    },
    {
      id: 'tgo',
      templateField: 'tgo',
      label: 'TGO',
      min: '12.0', 
      max: '42.0', 
      unit: 'g/dL'
    },
    {
      id: 'tgp',
      templateField: 'tgp',
      label: 'TGP',
      min: '15.0', 
      max: '52.0', 
      unit: 'U/L'
    },
    {
      id: 'fosfatasa_alcalina',
      templateField: 'fosfatasa_alcalina',
      label: 'Fosfatasa Alcalina',
      min: '23.0', 
      max: '212.0', 
      unit: 'U/L'
    },
    {
      id: 'gamma_glutamil',
      templateField: 'gamma_glutamil',
      label: 'Gamma Glutamil',
      min: '0.0', 
      max: '12.0', 
      unit: 'U/L'
    },
    {
      id: 'proteinas_totales',
      templateField: 'proteinas_totales',
      label: 'Proteínas Totales',
      min: '5.40', 
      max: '7.20', 
      unit: 'g/dL'
    },
    {
      id: 'globulina',
      templateField: 'globulina',
      label: 'Globulina',
      min: '2.70', 
      max: '4.40', 
      unit: 'g/dL'
    },
    {
      id: 'rel_ag',
      templateField: 'rel_ag',
      label: 'Relación A/G',
      min: '0.6', 
      max: '1.1', 
      unit: ''
    },
    {
      id: 'bilirrubina_total',
      templateField: 'bilirrubina_total',
      label: 'Bilirrubina Total',
      min: '0.0', 
      max: '0.80', 
      unit: 'mg/dL'
    },
    {
      id: 'bilirrubina_directa',
      templateField: 'bilirrubina_directa',
      label: 'Bilirrubina Directa',
      min: '0.0', 
      max: '0.25', 
      unit: 'mg/dL'
    },
    {
      id: 'bilirrubina_indirecta',
      templateField: 'bilirrubina_indirecta',
      label: 'Bilirrubina Indirecta',
      min: '0.0', 
      max: '0.40', 
      unit: 'mg/dL'
    },
    {
      id: 'dhl',
      templateField: 'dhl',
      label: 'Deshidrogenasa Láctica (DHL)',
      min: '', 
      max: '', 
      unit: ''
    },
    {
      id: 'amilasa',
      templateField: 'amilasa',
      label: 'Amilasa',
      min: '0.0', 
      max: '1500.00', 
      unit: 'u/L'
    },
    {
      id: 'lipasa',
      templateField: 'lipasa',
      label: 'Lipasa',
      min: '0.0', 
      max: '240.00', 
      unit: 'u/L'
    },
    {
      id: 'glucosa',
      templateField: 'glucosa',
      label: 'Glucosa',
      min: '70.0', 
      max: '105.0', 
      unit: 'mg/dL'
    },
    {
      id: 'nitrogeno_ureico',
      templateField: 'nitrogeno_ureico',
      label: 'Nitrógeno Uréico',
      min: '4,5', 
      max: '30.5', 
      unit: 'mg/dL'
    },
    {
      id: 'creatinina',
      templateField: 'creatinina',
      label: 'Creatinina',
      min: '0.6', 
      max: '1.4', 
      unit: 'mg/dL'
    },
    {
      id: 'urea',
      templateField: 'urea',
      label: 'Urea',
      min: '20.0', 
      max: '50.0', 
      unit: 'mg/dL'
    },
    {
      id: 'acido_urico',
      templateField: 'acido_urico',
      label: 'Ácido Úrico',
      min: '0.0', 
      max: '2.0', 
      unit: 'mg/dL'
    },
    {
      id: 'colesterol',
      templateField: 'colesterol',
      label: 'Colesterol',
      min: '135.0', 
      max: '260.0', 
      unit: 'mg/dL'
    },
    {
      id: 'trigliceridos',
      templateField: 'trigliceridos',
      label: 'Triglicéridos',
      min: '25.0', 
      max: '120.0', 
      unit: 'mg/dL'
    },
  ]
};
