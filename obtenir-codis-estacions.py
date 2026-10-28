#!/usr/bin/env python3
"""Genera el llistat de codis d'estació agrupats per línia de metro."""

import argparse
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
DEFAULT_INPUT = PROJECT_ROOT / "public" / "estacions-info.json"
METRO_LINES = {
    "L1",
    "L2",
    "L3",
    "L4",
    "L5",
    "L9S",
    "L9N",
    "L10S",
    "L10N",
    "L11",
}


def stations_by_line(data):
    """Retorna línies ordenades amb les estacions i els codis de TMB."""
    grouped = {}

    for feature in data.get("features", []):
        properties = feature.get("properties", {})
        line = properties.get("NOM_LINIA")
        station_name = properties.get("NOM_ESTACIO")
        station_code = properties.get("CODI_ESTACIO_LINIA")

        if line not in METRO_LINES or not station_name or station_code is None:
            continue

        grouped.setdefault(line, {})[station_code] = {
            "ordre": properties.get("ORDRE_ESTACIO", 0),
            "nom": station_name,
            "codi": station_code,
        }

    return {
        line: [
            {"nom": station["nom"], "codi": station["codi"]}
            for station in sorted(
                stations.values(), key=lambda station: (station["ordre"], station["nom"])
            )
        ]
        for line, stations in sorted(grouped.items())
    }


def main():
    parser = argparse.ArgumentParser(
        description="Agrupa les estacions de metro de TMB per línia."
    )
    parser.add_argument(
        "fitxer",
        nargs="?",
        type=Path,
        default=DEFAULT_INPUT,
        help=f"fitxer GeoJSON d'entrada (per defecte: {DEFAULT_INPUT})",
    )
    args = parser.parse_args()

    try:
        with args.fitxer.open(encoding="utf-8") as source:
            data = json.load(source)
    except OSError as error:
        parser.error(f"no es pot llegir {args.fitxer}: {error}")
    except json.JSONDecodeError as error:
        parser.error(f"JSON invàlid a {args.fitxer}: {error}")

    print(json.dumps(stations_by_line(data), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
