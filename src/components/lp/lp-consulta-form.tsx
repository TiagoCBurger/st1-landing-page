"use client";

import { FormEvent, useState } from "react";

import { coverageBairros } from "@/components/lp/lp-data";

type QuizStep = "address" | "contact" | "complete";

type LeadPayload = {
  bairro: string;
  rua: string;
  nome: string;
  email: string;
};

type LpConsultaFormProps = {
  selectedBairroId?: string;
  onBairroChange?: (bairroId: string) => void;
  onComplete?: (lead: LeadPayload) => void;
  className?: string;
};

export default function LpConsultaForm({
  selectedBairroId,
  onBairroChange,
  onComplete,
  className = "",
}: LpConsultaFormProps) {
  const defaultBairro = coverageBairros.find((b) => b.available)?.id ?? coverageBairros[0].id;
  const bairroValue = selectedBairroId ?? defaultBairro;
  const selectedBairro = coverageBairros.find((bairro) => bairro.id === bairroValue);

  const [step, setStep] = useState<QuizStep>("address");
  const [rua, setRua] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === "address") {
      setStep("contact");
      return;
    }

    const lead = {
      bairro: selectedBairro?.name ?? bairroValue,
      rua,
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
        <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-200 to-orange-200 text-sm font-black text-[#061322]">
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
              Primeiro me diga seu bairro e rua. Eu uso isso para consultar se a rota da ST1 passa pelo seu endereco.
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
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-orange-300 transition-all duration-500"
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

            <label className="block">
              <span className="text-sm font-bold text-cyan-100">Rua</span>
              <input
                name="rua"
                required
                value={rua}
                onChange={(event) => setRua(event.target.value)}
                placeholder="Digite o nome da sua rua"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#071426] px-4 py-3 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-orange-300 px-5 py-4 text-base font-black text-[#130905] shadow-[0_0_34px_rgba(255,121,31,0.36)] transition hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(255,121,31,0.5)]"
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
                {selectedBairro?.name ?? bairroValue} • {rua}
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
                className="rounded-2xl bg-gradient-to-r from-orange-400 to-cyan-200 px-5 py-4 text-base font-black text-[#07111f] shadow-[0_0_34px_rgba(255,121,31,0.28)] transition hover:-translate-y-0.5"
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
