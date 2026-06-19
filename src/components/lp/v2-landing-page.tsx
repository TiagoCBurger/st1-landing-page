"use client";

import { FormEvent, useState } from "react";

import { coverageBairros, faqs, painPoints, plans, stats } from "@/components/lp/lp-data";

type Lead = {
  bairro: string;
  rua: string;
  nome: string;
  whatsapp: string;
};

export default function V2LandingPage() {
  const availableBairros = coverageBairros.filter((bairro) => bairro.available);
  const [selectedBairroId, setSelectedBairroId] = useState("");
  const [rua, setRua] = useState("");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCoverage, setIsLoadingCoverage] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const selectedBairro = availableBairros.find((bairro) => bairro.id === selectedBairroId);

  function handleAddressSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedBairro) {
      setStatus("Selecione um bairro para continuar.");
      return;
    }

    if (rua.trim().length < 3) {
      setStatus("Digite o nome da rua para consultar.");
      return;
    }

    setStatus("");
    setIsModalOpen(true);
  }

  function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (nome.trim().length < 3) {
      setStatus("Digite seu nome completo.");
      return;
    }

    if (whatsapp.trim().length < 8) {
      setStatus("Digite um WhatsApp válido.");
      return;
    }

    const nextLead = {
      bairro: selectedBairro?.name ?? "",
      rua: rua.trim(),
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
    };

    setLead(nextLead);
    setIsModalOpen(false);
    setIsLoadingCoverage(true);
    setStatus("");

    window.setTimeout(() => {
      setIsLoadingCoverage(false);
      setShowResults(true);
      document.getElementById("planos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1800);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050914] text-white">
      <section className="relative isolate min-h-screen px-5 pb-16 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(0,148,255,0.36),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(255,114,26,0.30),transparent_32%),linear-gradient(135deg,#050914_0%,#07182c_52%,#080b12_100%)]" />
        <div className="absolute left-1/2 top-28 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-3xl" />

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
            href="#consulta"
            className="rounded-full border border-orange-300/40 bg-orange-400 px-5 py-2.5 text-sm font-extrabold text-[#120804] shadow-[0_0_32px_rgba(255,121,31,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-300"
          >
            Consultar rua
          </a>
        </div>

        <div id="topo" className="mx-auto grid max-w-7xl items-center gap-10 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
              <span className="size-2 rounded-full bg-orange-400 shadow-[0_0_18px_#ff8a1d]" />
              Consulta de cobertura ST1
            </div>

            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Escolha seu bairro.
              <span className="block bg-gradient-to-r from-cyan-200 via-white to-orange-200 bg-clip-text text-transparent">
                Depois diga sua rua.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              O Starzinho consulta a rota da ST1 por bairro e rua. Depois de confirmar seus dados, mostramos os planos
              residenciais disponíveis.
            </p>
          </div>

          <div id="consulta" className="relative">
            <div className="absolute -inset-5 rounded-[2.75rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-orange-400/20 blur-2xl" />
            <div className="relative rounded-[2.5rem] border border-white/12 bg-[#07111f]/90 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur sm:p-7">
              <div className="mb-6 rounded-[2rem] border border-cyan-200/15 bg-cyan-300/10 p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Passo 1</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
                  Consulte se a ST1 chega na sua rua
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Primeiro selecione um bairro com rota disponível. Em seguida, informe o nome da rua.
                </p>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-bold text-cyan-100">Bairro</span>
                  <select
                    value={selectedBairroId}
                    onChange={(event) => {
                      setSelectedBairroId(event.target.value);
                      setRua("");
                      setStatus("");
                      setShowResults(false);
                    }}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-4 text-white outline-none ring-cyan-300/30 transition focus:border-cyan-300 focus:ring-4"
                    required
                  >
                    <option value="">Selecione seu bairro</option>
                    {availableBairros.map((bairro) => (
                      <option key={bairro.id} value={bairro.id}>
                        {bairro.name}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedBairro ? (
                  <label className="block">
                    <span className="text-sm font-bold text-cyan-100">Rua</span>
                    <input
                      value={rua}
                      onChange={(event) => {
                        setRua(event.target.value);
                        setStatus("");
                        setShowResults(false);
                      }}
                      placeholder="Digite o nome da sua rua"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-4 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                      required
                    />
                  </label>
                ) : null}

                {status ? <p className="text-sm leading-6 text-orange-200">{status}</p> : null}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-cyan-200 px-6 py-4 text-base font-black text-[#07111f] shadow-[0_0_34px_rgba(255,121,31,0.28)] transition hover:-translate-y-0.5"
                >
                  Buscar disponibilidade
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-[#02050d]/80 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/12 bg-[#07111f] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.6)]">
            <div className="rounded-[1.5rem] border border-cyan-200/15 bg-cyan-300/10 p-4">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Passo 2</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Para continuar, informe seus dados</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Vamos consultar: {selectedBairro?.name}, {rua}.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-cyan-100">Nome completo</span>
                <input
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite seu nome"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-4 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-cyan-100">WhatsApp</span>
                <input
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  inputMode="tel"
                  placeholder="(98) 90000-0000"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-4 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                  required
                />
              </label>

              {status ? <p className="text-sm leading-6 text-orange-200">{status}</p> : null}

              <div className="grid gap-3 sm:grid-cols-[0.72fr_1.28fr]">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setStatus("");
                  }}
                  className="rounded-2xl border border-white/10 px-5 py-4 text-sm font-black text-cyan-100 transition hover:bg-white/10"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-orange-400 to-cyan-200 px-5 py-4 text-base font-black text-[#07111f] transition hover:-translate-y-0.5"
                >
                  Avançar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isLoadingCoverage ? (
        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-[#07111f] p-8 text-center shadow-2xl">
            <div className="mx-auto size-16 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-200" />
            <h2 className="mt-6 text-3xl font-black tracking-[-0.05em] text-white">Consultando rota da ST1...</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Estamos verificando o bairro, a rua e preparando os planos residenciais para sua consulta.
            </p>
          </div>
        </section>
      ) : null}

      {showResults ? (
        <>
          <section id="planos" className="px-5 py-20 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">Planos e pricing</p>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                    Planos liberados para sua consulta
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-slate-300">
                    Endereço em análise: {lead?.bairro}, {lead?.rua}. Um atendente confirma a disponibilidade final pelo
                    WhatsApp {lead?.whatsapp}.
                  </p>
                </div>

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
                    </article>
                  ))}
                </div>
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
        </>
      ) : null}
    </main>
  );
}
