export const sampleData = {
  namasteData: [
    {
      code: "NAM-AYU-103",
      name: "Jvara",
      description: "Fever condition in Ayurveda, characterized by elevated body temperature",
      system: "Ayurveda"
    },
    {
      code: "NAM-AYU-201",
      name: "Prameha",
      description: "Metabolic disorder similar to diabetes in Ayurveda",
      system: "Ayurveda"
    },
    {
      code: "NAM-SID-301",
      name: "Vatha Noi",
      description: "Joint pain and arthritis-like condition in Siddha medicine",
      system: "Siddha"
    },
    {
      code: "NAM-HOM-501",
      name: "Arsenicum Album",
      description: "Homeopathy remedy for digestive and anxiety conditions",
      system: "Homeopathy"
    },
    {
      code: "NAM-AYU-104",
      name: "Kasa",
      description: "Cough and respiratory conditions in Ayurveda",
      system: "Ayurveda"
    },
    {
      code: "NAM-AYU-202",
      name: "Shotha",
      description: "Inflammatory swelling conditions in Ayurveda",
      system: "Ayurveda"
    },
    {
      code: "NAM-SID-302",
      name: "Mega Noi",
      description: "Brain and neurological disorders in Siddha",
      system: "Siddha"
    },
    {
      code: "NAM-HOM-502",
      name: "Belladonna",
      description: "Homeopathy remedy for acute inflammatory conditions",
      system: "Homeopathy"
    }
  ],
  icdData: [
    {
      code: "1D44",
      name: "Fever of unknown origin",
      category: "Symptoms, signs and abnormal clinical findings"
    },
    {
      code: "5A11",
      name: "Type 2 Diabetes Mellitus",
      category: "Endocrine, nutritional and metabolic diseases"
    },
    {
      code: "FA20",
      name: "Rheumatoid Arthritis",
      category: "Diseases of the musculoskeletal system"
    },
    {
      code: "XM123456",
      name: "Homeopathy – remedy related condition",
      category: "Traditional medicine codes"
    },
    {
      code: "CA40",
      name: "Cough",
      category: "Symptoms, signs and abnormal clinical findings"
    },
    {
      code: "ME84",
      name: "Localised swelling, mass or lump",
      category: "Symptoms, signs and abnormal clinical findings"
    },
    {
      code: "8E4Z",
      name: "Neurological disorder, unspecified",
      category: "Diseases of the nervous system"
    },
    {
      code: "1A00",
      name: "Acute inflammatory disorders",
      category: "Certain infectious or parasitic diseases"
    }
  ],
  mappingSuggestions: {
    "NAM-AYU-103": [
      { icdCode: "1D44", matchType: "exact", confidence: 95 }
    ],
    "NAM-AYU-201": [
      { icdCode: "5A11", matchType: "approximate", confidence: 85 }
    ],
    "NAM-SID-301": [
      { icdCode: "FA20", matchType: "approximate", confidence: 80 }
    ],
    "NAM-HOM-501": [
      { icdCode: "XM123456", matchType: "partial", confidence: 75 }
    ],
    "NAM-AYU-104": [
      { icdCode: "CA40", matchType: "exact", confidence: 90 }
    ],
    "NAM-AYU-202": [
      { icdCode: "ME84", matchType: "approximate", confidence: 82 }
    ],
    "NAM-SID-302": [
      { icdCode: "8E4Z", matchType: "approximate", confidence: 78 }
    ],
    "NAM-HOM-502": [
      { icdCode: "1A00", matchType: "approximate", confidence: 85 }
    ]
  }
};