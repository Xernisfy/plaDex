// https://www.bisafans.de/spiele/editionen/legenden-arceus/fundorte.php

import { DOMParser } from 'jsr:@b-fuze/deno-dom';

const parseHtml =
  ((p) => (source: string) => p.parseFromString.call(p, source, 'text/html'))(
    new DOMParser(),
  );

const regionMap: Record<string, string> = {
  // Obsidian-Grasland
  'Ambitionshügel': 'og',
  'Baumriesenkampffeld': 'og',
  'Erztunnel': 'og',
  'Felsenbrücke': 'og',
  'Flora-Rodefläche': 'og',
  'Geweihanhöhe': 'og',
  'Geweihbergweg': 'og',
  'Hamanasu-Insel': 'og',
  'Hufeisenwiesen': 'og',
  'Innerwald': 'og',
  'Mündungsdamm': 'og',
  'Obsidian-Wasserfall': 'og',
  'Sandgemmenheide': 'og',
  'See der Wahrheit': 'og',
  'Strapazenhain': 'og',
  'Waldesküche': 'og',
  'Windpassage': 'og',
  // Rotes Sumpfland
  'Bühnenkampffeld': 'rs',
  'Diamant-Ebene': 'rs',
  'Diamant-Siedlung': 'rs',
  'Geröllhügel': 'rs',
  'Großmaulmoor': 'rs',
  'Güldene Felder': 'rs',
  'Nebelruinen': 'rs',
  'Prankenplatz': 'rs',
  'Prüfungsbarre': 'rs',
  'Purpurrotes Moor': 'rs',
  'Schlammplateau': 'rs',
  'See der Kühnheit': 'rs',
  'Surrende Felder': 'rs',
  'Wolkenmeerkamm': 'rs',
  'Wollgraswiese': 'rs',
  // Kobalt-Küstenland
  'Badelagune': 'kk',
  'Feuerspei-Insel': 'kk',
  'Ginkgo-Strand': 'kk',
  'Griffel-Hügel': 'kk',
  'Großfischfelsen': 'kk',
  'Inselblickufer': 'kk',
  'Kleine Meeresgrotte': 'kk',
  'Küste der Verirrten': 'kk',
  'Lavadom-Schrein': 'kk',
  'Quellenpfad': 'kk',
  'Sandfinger': 'kk',
  'Schauriger Welkwald': 'kk',
  'Schleierkap': 'kk',
  'Seegrasidyll': 'kk',
  'Stilles Binnenmeer': 'kk',
  'Tombolo-Weg': 'kk',
  'Übergangshang': 'kk',
  'Versteckte Bucht': 'kk',
  'Windbruchwald': 'kk',
  // Kraterberg-Hochland
  'Bizarre Höhle': 'kh',
  'Einsame Quelle': 'kh',
  'Elysien-Bergpfad': 'kh',
  'Elysien-Tempelruinen': 'kh',
  'Feenweiher': 'kh',
  'Geröllberge': 'kh',
  'Gipfelschwadentunnel': 'kh',
  'Kletterklippe': 'kh',
  'Mondgrußkampffeld': 'kh',
  'Pilgerpfad': 'kh',
  'Platz der Huldigung': 'kh',
  'Sakralplateau': 'kh',
  'Speersäule': 'kh',
  'Steinplattenpass': 'kh',
  'Uralter Steinbruch': 'kh',
  'Urzeitliche Höhle': 'kh',
  'Wirrwald': 'kh',
  // Weißes Frostland
  'Arktilas-Eisblock': 'wf',
  'Blizzardtal': 'wf',
  'Blizzard-Tempel': 'wf',
  'Eisgipfelhöhle': 'wf',
  'Eisige Ödnis': 'wf',
  'Eissäulenkammer': 'wf',
  'Firnfälle': 'wf',
  'Geistesfelsen': 'wf',
  'Gletscherpassage': 'wf',
  'Gletscherstufen': 'wf',
  'Lawinenhügel': 'wf',
  'Pfad zum Kampffeld': 'wf',
  'Schneeblicktherme': 'wf',
  'See der Stärke': 'wf',
  'Sinnoh-Tempel': 'wf',
};

const document = parseHtml(
  await (await fetch(
    'https://www.bisafans.de/spiele/editionen/legenden-arceus/fundorte.php',
  )).text(),
);
const regions: Record<string, string[]> = {};
document.querySelectorAll('table tr').forEach((node, index) => {
  const entryRegions: string[] = [];
  node.querySelectorAll('.list-inline a[href*="routendex"]').forEach((a) => {
    entryRegions.push(a.textContent.replace(' (Wackelnder Baum)', ''));
  });
  if (entryRegions.length) {
    regions[index] = [...new Set(entryRegions.map((e) => regionMap[e]))];
  }
});
Deno.writeTextFileSync(
  import.meta.dirname + '/regions.json',
  JSON.stringify(regions, null, 2),
);
