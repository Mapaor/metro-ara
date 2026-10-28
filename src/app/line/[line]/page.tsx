import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { isLineCode, lineCodes, lineColors, stationCodes, stationSlug } from "../../../utils/metro-lines";

type Props = { params: Promise<{ line: string }> };

export function generateStaticParams() {
  return lineCodes.map((line) => ({ line }));
}

export default async function LinePage({ params }: Props) {
  const { line } = await params;
  if (!isLineCode(line)) notFound();

  return (
    <main className="page line-page">
      <nav className="breadcrumb" aria-label="Navegació"><Link href="/">← Línies</Link></nav>
      <h1 className="page-title line-page-title">
        <span className="line-code" style={{ "--line-color": lineColors[line] } as CSSProperties}>{line}</span>
      </h1>
      <div className="route-scroll">
        <ol className="route-track" style={{ "--line-color": lineColors[line] } as CSSProperties} aria-label={`Estacions de la línia ${line}`}>
          {stationCodes[line].map((station) => (
            <li className="route-stop" key={station.codi}>
              <Link href={`/station/${stationSlug(station.nom)}?line=${line}`} className="route-stop-link" aria-label={station.nom}>
                <span className="route-station-name">{station.nom}</span>
                <span className="route-node" aria-hidden="true"><span /></span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
