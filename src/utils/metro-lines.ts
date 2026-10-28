// Ens guardem la informació (estàtica) que hem descarregat com a JSON i convertit
// i guardat a la carpeta `public/`, com a arrays interns de JS

import stationData from "../../public/codis-estacions.json";

export const lineCodes = ["L1", "L2", "L3", "L4", "L5", "L9S", "L9N", "L10S", "L10N", "L11"] as const;

export type LineCode = (typeof lineCodes)[number];
export type Station = { nom: string; codi: number };
export type StationLocation = { line: LineCode; code: number };
export type NetworkStation = { name: string; slug: string; locations: StationLocation[] };

export const lineColors: Record<LineCode, string> = {
  L1: "#cb2508",
  L2: "#90278e",
  L3: "#067634",
  L4: "#ffc10e",
  L5: "#006b9d",
  L9S: "#df8d33",
  L9N: "#df8d33",
  L10S: "#31a8e0",
  L10N: "#31a8e0",
  L11: "#9ed84c",
};

export const stationCodes = stationData as Record<LineCode, Station[]>;

export function isLineCode(value: string): value is LineCode {
  return lineCodes.includes(value as LineCode);
}

function stationKey(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("ca");
}

export function stationSlug(name: string) {
  return stationKey(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const groupedStations = new Map<string, NetworkStation>();

for (const line of lineCodes) {
  for (const station of stationCodes[line]) {
    const key = stationKey(station.nom);
    const entry = groupedStations.get(key) ?? {
      name: station.nom,
      slug: stationSlug(station.nom),
      locations: [],
    };
    entry.locations.push({ line, code: station.codi });
    groupedStations.set(key, entry);
  }
}

export const networkStations = [...groupedStations.values()];
