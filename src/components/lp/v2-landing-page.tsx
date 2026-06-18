"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";

import LpConsultaForm from "@/components/lp/lp-consulta-form";
import { faqs, painPoints, plans, stats, steps } from "@/components/lp/lp-data";
import { saoLuisBairrosGeoJson } from "@/data/sao-luis-bairros";

const BairroMap = dynamic(() => import("@/components/bairro-map"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center bg-[#050914] text-sm text-slate-400">
      Carregando mapa de cobertura...
    </div>
  ),
});

const bairroMapLookup: Record<string, string> = {
  cohatrac: "cohama",
};

type LeadSummary = {
  bairro: string;
  rua: string;
  nome: string;
  email: string;
};

export default function V2LandingPage() {
  const [selectedBairroId, setSelectedBairroId] = useState("cohatrac");
  const [lead, setLead] = useState<LeadSummary | null>(null);

  const selectedFeature = useMemo(() => {
    const mapId = bairroMapLookup[selectedBairroId];
    if (!mapId) {
      return null;
    }

    return saoLuisBairrosGeoJson.features.find((feature) => feature.properties.id === mapId) ?? null;
  }, [selectedBairroId]);

  const hasLead = Boolean(lead);

  function handleLeadComplete(nextLead: LeadSummary) {
    setLead(nextLead);
    window.setTimeout(() => {
      document.getElementById("planos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050914] text-white">
      <section className="relative isolate min-h-screen px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(0,148,255,0.36),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(255,114,26,0.30),transparent_32%),linear-gradient(135deg,#050914_0%,#07182c_52%,#080b12_100%)]" />
        <div className="absolute left-1/2 top-28 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
          <div className="absolute left-[7%] top-[22%] h-px w-[42%] bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <div className="absolute right-[5%] top-[52%] h-px w-[36%] bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />
          <div className="absolute bottom-[12%] left-[16%] h-px w-[52%] rotate-[-8deg] bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#topo" className="flex items-center gap-3" aria-label="ST1 Internet">
            <span className="grid size-11 place-items-center rounded-2xl bg-white text-lg font-black text-[#072f78] shadow-[0_0_28px_rgba(0,148,255,0.35)]">
              ST1
            </span>
            <span className="hidden text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:inline">
              Internet Fibra
            </span>
          </a>
          <a
            href="#quiz"
            className="rounded-full border border-orange-300/40 bg-orange-400 px-5 py-2.5 text-sm font-extrabold text-[#120804] shadow-[0_0_32px_rgba(255,121,31,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-300"
          >
            Começar quiz
          </a>
        </div>

        <div id="topo" className="mx-auto max-w-7xl pt-12 lg:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
              <span className="size-2 rounded-full bg-orange-400 shadow-[0_0_18px_#ff8a1d]" />
              Quiz de cobertura com o Starzinho
            </div>

            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Me diga sua rua.
              <span className="block bg-gradient-to-r from-cyan-200 via-white to-orange-200 bg-clip-text text-transparent">
                Eu busco a rota no mapa.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              O Starzinho primeiro consulta seu endereço. Só depois ele pede nome e email para liberar os planos
              residenciais da ST1.
            </p>

            <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {["Endereço", "Nome + email", "Planos liberados"].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-orange-200">
                    Passo {index + 1}
                  </span>
                  <p className="mt-2 text-sm font-bold text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="quiz" className="relative mt-10 lg:mt-14">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-orange-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.75rem] border border-white/12 bg-[#07111f]/90 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
                <div className="relative min-h-[460px] overflow-hidden rounded-[2.25rem] border border-cyan-200/10 bg-[#050914]">
                  <div className="absolute inset-x-0 top-0 z-[500] border-b border-white/10 bg-[#07111f]/85 px-5 py-4 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-200">Mapa interativo</p>
                    <p className="mt-1 text-sm text-slate-300">Selecione o bairro no chat e confira a rota no mapa.</p>
                  </div>
                  <BairroMap selectedFeature={selectedFeature} variant="dark" />
                  <div className="pointer-events-none absolute bottom-5 left-5 z-[500] rounded-2xl border border-cyan-200/20 bg-[#07111f]/85 px-4 py-3 shadow-xl backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">Rota em análise</p>
                    <p className="mt-1 text-sm font-bold text-white">São Luís • Cohatrac</p>
                  </div>
                </div>

                <div className="relative flex min-h-[460px] flex-col justify-end rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,rgba(0,148,255,0.22),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-44 overflow-hidden rounded-t-[2.25rem]">
                    <Image
                      src="/startzinho2.png"
                      alt="Starzinho, mascote da ST1, guiando o quiz de cobertura"
                      width={257}
                      height={300}
                      priority
                      className="absolute left-1/2 top-3 w-40 -translate-x-1/2 drop-shadow-[0_22px_38px_rgba(0,148,255,0.35)] sm:w-44"
                    />
                  </div>
                  <LpConsultaForm
                    selectedBairroId={selectedBairroId}
                    onBairroChange={setSelectedBairroId}
                    onComplete={handleLeadComplete}
                    className="mt-36"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-orange-300">Por que consultar primeiro?</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              A rota de fibra depende da sua rua, não só do bairro.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Por isso o quiz começa pelo endereço. Com bairro e rua, a equipe da ST1 recebe um lead com contexto
              suficiente para consultar viabilidade antes de falar sobre instalação.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {steps.slice(0, 4).map(([title, text], index) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
                <span className="grid size-11 place-items-center rounded-2xl bg-cyan-300 text-sm font-black text-[#04101f]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-black tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">Planos e pricing</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                {hasLead ? "Planos liberados para sua consulta" : "Complete o quiz para liberar os planos"}
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                {hasLead
                  ? `Endereço em análise: ${lead?.bairro}, ${lead?.rua}. Agora veja as opções residenciais da ST1.`
                  : "Os valores aparecem depois que o Starzinho captura o endereço, nome e email. Isso mantém a experiência focada em consulta de cobertura."}
              </p>
              {!hasLead ? (
                <a
                  href="#quiz"
                  className="mt-7 inline-flex rounded-full bg-orange-400 px-6 py-3 font-black text-[#130905] transition hover:-translate-y-0.5"
                >
                  Responder quiz
                </a>
              ) : null}
            </div>

            {hasLead ? (
              <div className="grid gap-5 md:grid-cols-2">
                {plans.map((plan) => (
                  <article
                    key={plan.name}
                    className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#081629] p-6 shadow-2xl"
                  >
                    <div className="absolute -right-14 -top-14 size-40 rounded-full bg-cyan-300/10 blur-2xl" />
                    <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-300">{plan.label}</p>
                    <h3 className="mt-5 text-5xl font-black tracking-[-0.06em] text-white">{plan.name}</h3>
                    <p className="mt-2 text-2xl font-black text-cyan-200">{plan.price}</p>
                    <p className="mt-5 text-sm leading-6 text-slate-300">{plan.description}</p>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-100">
                          <span className="size-2 rounded-full bg-cyan-200 shadow-[0_0_14px_#67e8f9]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#quiz"
                      className="mt-7 inline-flex w-full justify-center rounded-2xl border border-cyan-200/30 px-5 py-3 font-black text-cyan-100 transition hover:bg-cyan-200 hover:text-[#04101f]"
                    >
                      Continuar atendimento
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#081629] p-8 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,148,255,0.18),transparent_36%)]" />
                <div className="relative">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-300">Pricing bloqueado</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((item) => (
                      <div key={item} className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 blur-[1px]">
                        <div className="h-8 w-28 rounded-full bg-white/15" />
                        <div className="mt-5 h-12 w-40 rounded-full bg-white/10" />
                        <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
                        <div className="mt-3 h-4 w-3/4 rounded-full bg-white/10" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl border border-cyan-200/15 bg-cyan-300/10 p-4">
                    <p className="text-sm font-bold leading-6 text-cyan-50">
                      O Starzinho libera essa etapa depois do endereço, nome e email.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-orange-300">Chega de conexão instável</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Internet para a rotina real da sua casa.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {painPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-cyan-200/30"
              >
                <span className="mb-5 block size-3 rounded-full bg-orange-300 shadow-[0_0_22px_#fb923c]" />
                <h3 className="text-lg font-black tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">ST1 no Maranhão</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              A ST1 já conecta milhares de pessoas no Maranhão
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Uma rede em expansão, feita para entregar mais velocidade e estabilidade para a rotina dos clientes.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map(([title, text]) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
                <h3 className="text-lg font-black tracking-[-0.03em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-orange-300">Perguntas frequentes</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Antes de consultar sua rota
          </h2>
          <div className="mt-10 divide-y divide-white/10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055]">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group p-5 open:bg-white/[0.04] sm:p-6">
                <summary className="cursor-pointer list-none text-lg font-black tracking-[-0.03em] text-white">
                  {question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-orange-200/20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,121,31,0.26),transparent_30%),linear-gradient(135deg,#07182c,#050914)] p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Quer que o Starzinho consulte sua rua?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Comece pelo endereço no mapa. Depois informe nome e email para liberar os planos da ST1.
          </p>
          <a
            href="#quiz"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-orange-400 to-cyan-200 px-8 py-4 font-black text-[#07111f] transition hover:-translate-y-0.5"
          >
            Começar quiz agora
          </a>
        </div>
      </section>
    </main>
  );
}
