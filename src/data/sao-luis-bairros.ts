export type BairroFeature = {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    zone: string;
    postalCode: string;
    centroid: [number, number];
    radiusKm: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: [[number, number][]];
  };
};

export type BairroFeatureCollection = {
  type: "FeatureCollection";
  name: string;
  properties: {
    city: string;
    state: string;
    country: string;
    note: string;
  };
  features: BairroFeature[];
};

export const saoLuisBairrosGeoJson: BairroFeatureCollection = {
  type: "FeatureCollection",
  name: "sao-luis-bairros",
  properties: {
    city: "Sao Luis",
    state: "Maranhao",
    country: "Brasil",
    note: "Poligonos aproximados para uso funcional em formulario e mapa. Substitua por limites oficiais quando disponiveis.",
  },
  features: [
    {
      type: "Feature",
      properties: {
        id: "centro",
        name: "Centro",
        zone: "Centro Historico",
        postalCode: "65015-310",
        centroid: [-44.2991183, -2.5318416],
        radiusKm: 1.2,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.3155, -2.5505],
          [-44.2828, -2.5505],
          [-44.2828, -2.5132],
          [-44.3155, -2.5132],
          [-44.3155, -2.5505],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "calhau",
        name: "Calhau",
        zone: "Orla",
        postalCode: "65065-180",
        centroid: [-44.26922, -2.4908678],
        radiusKm: 1.3,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2868, -2.5064],
          [-44.2516, -2.5064],
          [-44.2516, -2.4753],
          [-44.2868, -2.4753],
          [-44.2868, -2.5064],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "jardim-renascenca",
        name: "Jardim Renascenca",
        zone: "Area Nobre",
        postalCode: "65075-060",
        centroid: [-44.2900562, -2.50084],
        radiusKm: 1.1,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.3062, -2.5162],
          [-44.2739, -2.5162],
          [-44.2739, -2.4855],
          [-44.3062, -2.4855],
          [-44.3062, -2.5162],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "sao-francisco",
        name: "Sao Francisco",
        zone: "Area Nobre",
        postalCode: "65076-250",
        centroid: [-44.3040792, -2.511897],
        radiusKm: 1.1,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.3202, -2.5273],
          [-44.2880, -2.5273],
          [-44.2880, -2.4965],
          [-44.3202, -2.4965],
          [-44.3202, -2.5273],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "ponta-do-farol",
        name: "Ponta do Farol",
        zone: "Orla",
        postalCode: "65075-832",
        centroid: [-44.2948775, -2.4908823],
        radiusKm: 1,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.3095, -2.5052],
          [-44.2803, -2.5052],
          [-44.2803, -2.4766],
          [-44.3095, -2.4766],
          [-44.3095, -2.5052],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "turu",
        name: "Turu",
        zone: "Eixo Turu",
        postalCode: "65045-470",
        centroid: [-44.225148, -2.5203175],
        radiusKm: 1.8,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2509, -2.5446],
          [-44.1994, -2.5446],
          [-44.1994, -2.4960],
          [-44.2509, -2.4960],
          [-44.2509, -2.5446],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "cohama",
        name: "Cohama",
        zone: "Eixo Turu",
        postalCode: "65074-100",
        centroid: [-44.2459198, -2.514075],
        radiusKm: 1.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2674, -2.5343],
          [-44.2245, -2.5343],
          [-44.2245, -2.4938],
          [-44.2674, -2.4938],
          [-44.2674, -2.5343],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "vinhais",
        name: "Vinhais",
        zone: "Area Residencial",
        postalCode: "65071-330",
        centroid: [-44.2553796, -2.5139466],
        radiusKm: 1.4,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2754, -2.5328],
          [-44.2354, -2.5328],
          [-44.2354, -2.4951],
          [-44.2754, -2.4951],
          [-44.2754, -2.5328],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "anil",
        name: "Anil",
        zone: "Area Central Expandida",
        postalCode: "65046-820",
        centroid: [-44.2385796, -2.5467256],
        radiusKm: 1.7,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2629, -2.5697],
          [-44.2143, -2.5697],
          [-44.2143, -2.5238],
          [-44.2629, -2.5238],
          [-44.2629, -2.5697],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "joao-paulo",
        name: "Joao Paulo",
        zone: "Corredor Urbano",
        postalCode: "65040-150",
        centroid: [-44.2724433, -2.5448596],
        radiusKm: 1.3,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2910, -2.5624],
          [-44.2539, -2.5624],
          [-44.2539, -2.5273],
          [-44.2910, -2.5273],
          [-44.2910, -2.5624],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "cidade-operaria",
        name: "Cidade Operaria",
        zone: "Area Residencial",
        postalCode: "65058-171",
        centroid: [-44.1978004, -2.5761558],
        radiusKm: 2,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2264, -2.6031],
          [-44.1692, -2.6031],
          [-44.1692, -2.5492],
          [-44.2264, -2.5492],
          [-44.2264, -2.6031],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "cohatrac",
        name: "Cohatrac",
        zone: "Area Residencial",
        postalCode: "65053-000",
        centroid: [-44.2142, -2.5376],
        radiusKm: 1.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-44.2357, -2.5579],
          [-44.1927, -2.5579],
          [-44.1927, -2.5173],
          [-44.2357, -2.5173],
          [-44.2357, -2.5579],
        ]],
      },
    },
  ],
};
