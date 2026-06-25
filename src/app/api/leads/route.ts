const MAKE_WEBHOOK_URL = "https://hook.us1.make.celonis.com/rt29tlllgknsrvbjt97t1co2xb958uge";

type LeadRequest = {
  bairro?: string;
  cidade?: string;
  rua?: string;
  nome?: string;
  whatsapp?: string;
  available?: boolean;
  source?: string;
};

export const dynamic = "force-dynamic";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: LeadRequest;

  try {
    body = (await request.json()) as LeadRequest;
  } catch {
    return Response.json({ message: "Payload inválido." }, { status: 400 });
  }

  const payload = {
    bairro: cleanString(body.bairro),
    cidade: cleanString(body.cidade),
    rua: cleanString(body.rua),
    nome: cleanString(body.nome),
    whatsapp: cleanString(body.whatsapp),
    available: Boolean(body.available),
    source: cleanString(body.source) || "lp-v2",
    submittedAt: new Date().toISOString(),
  };

  if (!payload.bairro || !payload.rua || !payload.nome || !payload.whatsapp) {
    return Response.json({ message: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!webhookResponse.ok) {
    return Response.json({ message: "Não foi possível enviar os dados." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
