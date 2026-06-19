import { NextRequest } from "next/server";

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
};

const fallbackResults: NominatimResult[] = [
  {
    place_id: 900001,
    display_name: "Rua 10, Conjunto Primavera, Cohatrac, São Luís, Maranhão, 65052-855, Brasil",
    lat: "-2.5377522",
    lon: "-44.1983443",
    type: "road",
  },
  {
    place_id: 900002,
    display_name: "Rua Dez, Parque Aurora, Cohatrac II, Cohatrac, São Luís, Maranhão, 65054-420, Brasil",
    lat: "-2.5350630",
    lon: "-44.2079176",
    type: "road",
  },
  {
    place_id: 900003,
    display_name: "Avenida Contorno Leste, Cohatrac, São Luís, Maranhão, Brasil",
    lat: "-2.5358200",
    lon: "-44.2041200",
    type: "road",
  },
  {
    place_id: 900004,
    display_name: "Avenida Leste Oeste, Cohatrac, São Luís, Maranhão, Brasil",
    lat: "-2.5391700",
    lon: "-44.2063500",
    type: "road",
  },
];

export const dynamic = "force-dynamic";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function mapResult(result: NominatimResult) {
  return {
    place_id: result.place_id,
    display_name: result.display_name,
    lat: result.lat,
    lon: result.lon,
    type: result.type ?? "address",
  };
}

function fallbackSearch(query: string) {
  const normalizedQuery = normalize(query);

  return fallbackResults
    .filter((result) => normalize(result.display_name).includes(normalizedQuery))
    .slice(0, 5)
    .map(mapResult);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 4) {
    return Response.json({ results: [] }, { status: 400 });
  }

  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "5",
    countrycodes: "br",
    bounded: "1",
    viewbox: "-44.44,-2.42,-44.14,-2.72",
    q: `${query}, São Luís, Maranhão, Brasil`,
  });

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "pt-BR,pt;q=0.9",
        "User-Agent": "ST1 Internet coverage landing page contato@st1.net.br",
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return Response.json({ results: fallbackSearch(query), source: "fallback" });
    }

    const remoteResults = ((await response.json()) as NominatimResult[]).map(mapResult);
    const results = remoteResults.length > 0 ? remoteResults : fallbackSearch(query);

    return Response.json({ results, source: remoteResults.length > 0 ? "nominatim" : "fallback" });
  } catch {
    return Response.json({ results: fallbackSearch(query), source: "fallback" });
  }
}
