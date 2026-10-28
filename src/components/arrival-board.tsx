"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { lineColors, type LineCode } from "../utils/metro-lines";

type Train = { codi_servei: string; temps_arribada: number };
type Journey = { desti_trajecte: string; propers_trens: Train[] };
type Platform = { linies_trajectes: Journey[] };
type ArrivalLine = { nom_linia: string; estacions: Platform[] };
type ArrivalResponse = { timestamp: number; linies: ArrivalLine[] };
type Props = { stationCodes: number[] };

function arrivalTime(timestamp: number, now: number) {
  if (!now) return "—";
  const seconds = Math.max(0, Math.floor((timestamp - now) / 1000));
  if (seconds < 35) return "Entra";
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function ArrivalBoard({ stationCodes }: Props) {
  const [data, setData] = useState<ArrivalResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(0);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const codes = stationCodes.join(",");
      const response = await fetch(`/api/arrivals?stations=${encodeURIComponent(codes)}`, { cache: "no-store", signal });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "No s’han pogut carregar les arribades.");
      setData(body as ArrivalResponse);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "AbortError") return;
      setError(caught instanceof Error ? caught.message : "No s’han pogut carregar les arribades.");
      setData(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [stationCodes]);

  useEffect(() => {
    const controller = new AbortController();
    const initialLoad = window.setTimeout(() => void load(controller.signal), 0);
    const refresh = window.setInterval(() => void load(), 30_000);
    return () => {
      controller.abort();
      window.clearTimeout(initialLoad);
      window.clearInterval(refresh);
    };
  }, [load]);

  useEffect(() => {
    const initialClock = window.setTimeout(() => setNow(Date.now()), 0);
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(initialClock);
      window.clearInterval(clock);
    };
  }, []);

  const journeys = (data?.linies ?? []).flatMap((arrivalLine) =>
    arrivalLine.estacions.flatMap((platform) =>
      platform.linies_trajectes.map((journey) => ({ line: arrivalLine.nom_linia, journey })),
    ),
  );

  return (
    <section className="arrivals" aria-label="Arribades de metro">
      <div className="arrival-list">
        {journeys.map(({ line: arrivalLine, journey }, index) => (
          <article className="direction" key={`${arrivalLine}-${journey.desti_trajecte}-${index}`}>
            <div className="direction-title">
              <span className="line-mark" style={{ "--line-color": lineColors[arrivalLine as LineCode] ?? "#555" } as CSSProperties}>{arrivalLine}</span>
              <span>{journey.desti_trajecte}</span>
            </div>
            <div className="trains">
              {[0, 1].map((trainIndex) => {
                const train = journey.propers_trens?.[trainIndex];
                return (
                  <div className={`train${trainIndex ? " train-next" : ""}`} key={train?.codi_servei ?? trainIndex}>
                    <span className="train-time">{train ? arrivalTime(train.temps_arribada, now) : "—"}</span>
                    {train && <span className="train-code">Torn {train.codi_servei}</span>}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      {error && <p className="arrival-message">{error}</p>}
      {loading && !data && !error && <p className="arrival-message">Carregant…</p>}
      {!loading && !error && journeys.length === 0 && <p className="arrival-message">Sense dades de pas.</p>}
      <button className="refresh" onClick={() => void load()} disabled={loading} aria-label="Actualitzar arribades">↻</button>
    </section>
  );
}
