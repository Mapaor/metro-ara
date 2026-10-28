import stationData from "../../public/codis-estacions.json";

export const lineCodes = ["L1", "L2", "L3", "L4", "L5", "L9S", "L9N", "L10S", "L10N", "L11"] as const;

export type LineCode = (typeof lineCodes)[number];
export type Station = { nom: string; codi: number };

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

export const lineNames: Record<LineCode, string> = {
  L1: "Hospital de Bellvitge — Fondo",
  L2: "Paral·lel — Badalona Pompeu Fabra",
  L3: "Zona Universitària — Trinitat Nova",
  L4: "La Pau — Trinitat Nova",
  L5: "Cornellà Centre — Vall d’Hebron",
  L9S: "Aeroport T1 — Zona Universitària",
  L9N: "La Sagrera — Can Zam",
  L10S: "ZAL | Riu Vell — Collblanc",
  L10N: "La Sagrera — Gorg",
  L11: "Trinitat Nova — Can Cuiàs",
};

export const stationCodes = stationData as Record<LineCode, Station[]>;

export function isLineCode(value: string): value is LineCode {
  return lineCodes.includes(value as LineCode);
}
