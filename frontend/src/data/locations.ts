export const citiesByBundesland: Record<string, string[]> = {
  Bayern: [
    'Würzburg',
    'Kitzingen',
    'Nürnberg',
    'München',
    'Augsburg',
    'Regensburg',
    'Ingolstadt',
  ],
  'Baden-Württemberg': [
    'Stuttgart',
    'Karlsruhe',
    'Mannheim',
    'Freiburg',
  ],
  Berlin: ['Berlin'],
  Brandenburg: [
    'Potsdam',
    'Cottbus',
    'Brandenburg an der Havel',
  ],
  Bremen: ['Bremen'],
  Hamburg: ['Hamburg'],
  Hessen: [
    'Wiesbaden',
    'Frankfurt am Main',
    'Kassel',
    'Darmstadt',
  ],
  'Mecklenburg-Vorpommern': [
    'Schwerin',
    'Rostock',
  ],
  Niedersachsen: [
    'Hannover',
    'Braunschweig',
    'Osnabrück',
  ],
  'Nordrhein-Westfalen': [
    'Düsseldorf',
    'Köln',
    'Dortmund',
    'Bonn',
  ],
  'Rheinland-Pfalz': [
    'Mainz',
    'Trier',
    'Koblenz',
  ],
  Saarland: [
    'Saarbrücken',
    'Homburg',
  ],
  Sachsen: [
    'Dresden',
    'Leipzig',
    'Chemnitz',
  ],
  'Sachsen-Anhalt': [
    'Magdeburg',
    'Halle',
  ],
  'Schleswig-Holstein': [
    'Kiel',
    'Lübeck',
  ],
  Thüringen: ['Erfurt'],
}

export const bundeslaender = Object.keys(citiesByBundesland)

export const getCities = (bundesland: string): string[] =>
  citiesByBundesland[bundesland] ?? []