import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArrivalBoard from "../../arrival-board";
import { isLineCode, lineCodes, stationCodes } from "../../metro-lines";

type Props = { params: Promise<{ line: string; station: string }> };

export function generateStaticParams() {
  return lineCodes.flatMap((line) => stationCodes[line].map((station) => ({
    line,
    station: String(station.codi),
  })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { line, station: stationCode } = await params;
  if (!isLineCode(line)) return {};
  const station = stationCodes[line].find(({ codi }) => codi === Number(stationCode));
  return station ? { title: `${station.nom} · ${line}` } : {};
}

export default async function StationPage({ params }: Props) {
  const { line, station: stationCode } = await params;
  if (!isLineCode(line)) notFound();
  const station = stationCodes[line].find(({ codi }) => codi === Number(stationCode));
  if (!station) notFound();

  return (
    <main className="page">
      <nav className="breadcrumb" aria-label="Navegació"><Link href={`/${line}`}>← {line}</Link></nav>
      <h1 className="page-title station-page-title">{station.nom}</h1>
      <ArrivalBoard line={line} stationCode={station.codi} />
    </main>
  );
}
