"use client";

import { FormEvent, useState } from "react";

import { coverageBairros } from "@/components/lp/lp-data";
import type { AddressMarker } from "@/components/bairro-map";

type QuizStep = "address" | "contact" | "complete";

type LeadPayload = {
  bairro: string;
  rua: string;
  endereco: string;
  lat: number;
  lng: number;
  nome: string;
  email: string;
};

type AddressResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

type LpConsultaFormProps = {
  selectedBairroId?: string;
  onBairroChange?: (bairroId: string) => void;
  onAddressSelect?: (address: AddressMarker | null) => void;
  onComplete?: (lead: LeadPayload) => void;
  className?: string;
};

export default function LpConsultaForm({
  selectedBairroId,
  onBairroChange,
  onAddressSelect,
  onComplete,
  className = "",
}: LpConsultaFormProps) {
  const defaultBairro = coverageBairros.find((b) => b.available)?.id ?? coverageBairros[0].id;
  const bairroValue = selectedBairroId ?? defaultBairro;
  const selectedBairro = coverageBairros.find((bairro) => bairro.id === bairroValue);

  const [step, setStep] = useState<QuizStep>("address");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressMarker | null>(null);
  const [addressStatus, setAddressStatus] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  async function searchAddress() {
    const query = addressQuery.trim();

    if (query.length < 4) {
      setAddressStatus("Digite pelo menos 4 caracteres para buscar o endereço.");
      return;
    }

    setIsSearchingAddress(true);
    setAddressStatus("");
    setAddressResults([]);
    setSelectedAddress(null);
    onAddressSelect?.(null);

    try {
      const params = new URLSearchParams({ q: query });
      const response = await fetch(`/api/geocode?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Address search failed");
      }

      const payload = (await response.json()) as { results: AddressResult[] };
      const results = payload.results;

      if (results.length === 0) {
        setAddressStatus("Não encontrei esse endereço. Tente incluir número, bairro ou uma rua próxima.");
        return;
      }

      setAddressResults(results);
      setAddressStatus("Selecione o endereço exato encontrado para marcar no mapa.");
    } catch {
      setAddressStatus("Não consegui buscar o endereço agora. Tente novamente em instantes.");
    } finally {
      setIsSearchingAddress(false);
    }
  }

  function selectAddress(result: AddressResult) {
    const address = {
      lat: Number(result.lat),
      lng: Number(result.lon),
      label: result.display_name,
    };

    setSelectedAddress(address);
    setAddressQuery(result.display_name);
    setAddressResults([]);
    setAddressStatus("Endereço marcado no mapa. Agora posso continuar a consulta.");
    onAddressSelect?.(address);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === "address") {
      if (!selectedAddress) {
        setAddressStatus("Escolha um endereço exato da lista antes de continuar.");
        return;
      }

      setStep("contact");
      return;
    }

    const lead = {
      bairro: selectedBairro?.name ?? bairroValue,
      rua: addressQuery,
      endereco: selectedAddress?.label ?? addressQuery,
      lat: selectedAddress?.lat ?? 0,
      lng: selectedAddress?.lng ?? 0,
      nome,
      email,
    };

    setStep("complete");
    onComplete?.(lead);
  }

  const progress = step === "address" ? "50%" : step === "contact" ? "78%" : "100%";

  return (
    <div
      className={`relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur ${className}`}
    >
      <div className="absolute -left-3 top-8 hidden size-6 rotate-45 border-b border-l border-white/10 bg-[#10213a] lg:block" />

      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-200 to-[#ff7400] text-sm font-black text-[#061322]">
          ST
        </div>
        <div>
          <p className="text-sm font-black text-white">Starzinho</p>
          <p className="text-xs text-cyan-100/80">guia de cobertura ST1</p>
        </div>
      </div>

      <div className="mb-5 rounded-[1.5rem] border border-cyan-200/15 bg-[#09182b]/85 p-4">
        {step === "address" ? (
          <>
            <p className="text-lg font-black tracking-[-0.03em] text-white">
              Opa, encontrei uma possivel rota perto de voce.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Busque seu endereço exato. Quando você selecionar um resultado, eu marco o ponto no mapa.
            </p>
          </>
        ) : null}

        {step === "contact" ? (
          <>
            <p className="text-lg font-black tracking-[-0.03em] text-white">
              Boa. Agora preciso saber com quem vou falar.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Depois desse passo eu libero os planos e deixo a consulta pronta para o atendimento.
            </p>
          </>
        ) : null}

        {step === "complete" ? (
          <>
            <p className="text-lg font-black tracking-[-0.03em] text-white">Consulta iniciada.</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Separei as opcoes residenciais abaixo. A disponibilidade final ainda depende da confirmacao tecnica da sua rua.
            </p>
          </>
        ) : null}
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-[#ff7400] transition-all duration-500"
          style={{ width: progress }}
        />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {step === "address" ? (
          <>
            <label className="block">
              <span className="text-sm font-bold text-cyan-100">Bairro</span>
              <select
                name="bairro"
                required
                value={bairroValue}
                onChange={(event) => onBairroChange?.(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#071426] px-4 py-3 text-white outline-none ring-cyan-300/30 transition focus:border-cyan-300 focus:ring-4"
              >
                {coverageBairros.map((bairro) => (
                  <option key={bairro.id} value={bairro.id} disabled={!bairro.available}>
                    {bairro.name}
                    {!bairro.available ? " (em breve)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <label className="block">
                <span className="text-sm font-bold text-cyan-100">Endereço exato</span>
                <input
                  name="endereco"
                  required
                  value={addressQuery}
                  onChange={(event) => {
                    setAddressQuery(event.target.value);
                    setSelectedAddress(null);
                    onAddressSelect?.(null);
                  }}
                  placeholder="Ex: Rua 10, Cohatrac, São Luís"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#071426] px-4 py-3 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                />
              </label>

              <button
                type="button"
                onClick={searchAddress}
                disabled={isSearchingAddress}
                className="mt-3 w-full rounded-2xl border border-cyan-200/25 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-50 transition hover:bg-cyan-300 hover:text-[#04101f] disabled:cursor-wait disabled:opacity-70"
              >
                {isSearchingAddress ? "Buscando endereço..." : "Buscar endereço no mapa"}
              </button>

              {addressStatus ? <p className="mt-3 text-xs leading-5 text-cyan-100/80">{addressStatus}</p> : null}

              {addressResults.length > 0 ? (
                <div className="mt-3 max-h-52 space-y-2 overflow-auto rounded-2xl border border-white/10 bg-[#050914]/70 p-2">
                  {addressResults.map((result) => (
                    <button
                      key={result.place_id}
                      type="button"
                      onClick={() => selectAddress(result)}
                      className="w-full rounded-xl px-3 py-3 text-left text-sm leading-5 text-slate-200 transition hover:bg-cyan-300/10 hover:text-white"
                    >
                      {result.display_name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#ff7400] px-5 py-4 text-base font-black text-[#130905] shadow-[0_0_34px_rgba(255,116,0,0.36)] transition hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(255,116,0,0.5)]"
            >
              Ver se encontrei rota
            </button>
          </>
        ) : null}

        {step === "contact" ? (
          <>
            <div className="rounded-2xl border border-cyan-200/15 bg-cyan-300/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">Endereco em consulta</p>
              <p className="mt-1 text-sm font-bold text-white">
                {selectedBairro?.name ?? bairroValue} • {selectedAddress?.label ?? addressQuery}
              </p>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-cyan-100">Nome completo</span>
              <input
                name="nome"
                required
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Digite seu nome completo"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#071426] px-4 py-3 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-cyan-100">Email</span>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#071426] px-4 py-3 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
              <button
                type="button"
                onClick={() => setStep("address")}
                className="rounded-2xl border border-white/10 px-5 py-4 text-sm font-black text-cyan-100 transition hover:bg-white/10"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[#ff7400] px-5 py-4 text-base font-black text-[#07111f] shadow-[0_0_34px_rgba(255,116,0,0.28)] transition hover:-translate-y-0.5"
              >
                Liberar planos
              </button>
            </div>
          </>
        ) : null}

        {step === "complete" ? (
          <a
            href="#planos"
            className="inline-flex w-full justify-center rounded-2xl bg-cyan-300 px-5 py-4 text-base font-black text-[#04101f] shadow-[0_0_34px_rgba(103,232,249,0.22)] transition hover:-translate-y-0.5"
          >
            Ver planos disponiveis
          </a>
        ) : null}
      </form>

      <p className="mt-4 text-center text-xs leading-5 text-slate-400">
        O plano nao precisa ser escolhido agora. Primeiro validamos a rota da sua rua.
      </p>
    </div>
  );
}
