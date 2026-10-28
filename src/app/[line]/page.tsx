import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { isLineCode, lineCodes, lineColors, stationCodes } from "../metro-lines";

type Props = { params: Promise<{ line: string }> };

export function generateStaticParams() {
  return lineCodes.map((line) => ({ line }));
}

export default async function LinePage({ params }: Props) {
  const { line } = await params;
  if (!isLineCode(line)) notFound();

  return (
    <main className="page">
      <nav className="breadcrumb" aria-label="Navegació"><Link href="/">← Línies</Link></nav>
      <h1 className="page-title line-page-title">
        <span className="line-code" style={{ "--line-color": lineColors[line] } as CSSProperties}>{line}</span>
      </h1>
      <ol className="station-list" style={{ "--line-color": lineColors[line] } as CSSProperties}>
        {stationCodes[line].map((station) => (
          <li key={station.codi}>
            <Link href={`/${line}/${station.codi}`} className="station-link">
              <span className="station-node" aria-hidden="true" />
              <span>{station.nom}</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
