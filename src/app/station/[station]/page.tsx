import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArrivalBoard from "../../../components/arrival-board";
import { isLineCode, networkStations } from "../../../utils/metro-lines";

type Props = {
  params: Promise<{ station: string }>;
  searchParams: Promise<{ line?: string }>;
};

export function generateStaticParams() {
  return networkStations.map(({ slug }) => ({ station: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station: slug } = await params;
  const station = networkStations.find((entry) => entry.slug === slug);
  return station ? { title: station.name } : {};
}

export default async function StationPage({ params, searchParams }: Props) {
  const [{ station: slug }, query] = await Promise.all([params, searchParams]);
  const station = networkStations.find((entry) => entry.slug === slug);
  if (!station) notFound();

  const sourceLine = query.line;
  const returnLine = sourceLine && isLineCode(sourceLine) && station.locations.some(({ line }) => line === sourceLine)
    ? sourceLine
    : station.locations[0].line;

  return (
    <main className="page station-page">
      <nav className="breadcrumb" aria-label="Navegació"><Link href={`/line/${returnLine}`}>← {returnLine}</Link></nav>
      <h1 className="page-title station-page-title">{station.name}</h1>
      <ArrivalBoard stationCodes={station.locations.map(({ code }) => code)} />
    </main>
  );
}
