import { NextResponse } from "next/server";

const TMB_URL = "https://api.tmb.cat/v1/itransit/metro/estacions";

export async function GET(request: Request) {
  const stations = new URL(request.url).searchParams.get("stations");

  if (!stations || !/^\d+(,\d+){0,9}$/.test(stations)) {
    return NextResponse.json({ error: "Codis d’estació invàlids." }, { status: 400 });
  }

  const appId = process.env.TMB_APP_ID;
  const appKey = process.env.TMB_APP_KEY;

  if (!appId || !appKey) {
    return NextResponse.json(
      { error: "Configura TMB_APP_ID i TMB_APP_KEY per consultar el servei en directe." },
      { status: 503 },
    );
  }

  const url = new URL(TMB_URL);
  url.searchParams.set("estacions", stations);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "TMB no ha pogut respondre la consulta. Torna-ho a provar." },
        { status: 502 },
      );
    }

    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json(
      { error: "No s’ha pogut connectar amb el servei de TMB." },
      { status: 502 },
    );
  }
}
