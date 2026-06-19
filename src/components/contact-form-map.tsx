'use client';

import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";

import { saoLuisBairrosGeoJson } from "@/data/sao-luis-bairros";

const BairroMap = dynamic(() => import("@/components/bairro-map"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center bg-slate-100 text-sm text-slate-500">
      Carregando mapa...
    </div>
  ),
});

const bairros = saoLuisBairrosGeoJson.features;

export default function ContactFormMap() {
  const [selectedBairroId, setSelectedBairroId] = useState(bairros[0]?.properties.id ?? "");
  const [status, setStatus] = useState("");

  const selectedFeature = useMemo(
    () => bairros.find((feature) => feature.properties.id === selectedBairroId) ?? null,
    [selectedBairroId],
  );

  const selectedGeoJson = useMemo(() => {
    if (!selectedFeature) {
      return "";
    }

    return JSON.stringify(
      {
        type: "FeatureCollection",
        features: [selectedFeature],
      },
      null,
      2,
    );
  }, [selectedFeature]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Mensagem pronta para envio. Bairro vinculado ao contato.");
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#333399]">
              Contato
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Atendimento por bairro em Sao Luis
            </h1>
          </div>

          <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Nome</span>
              <input
                name="name"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#333399] focus:ring-2 focus:ring-[#7f5aff]/20"
                placeholder="Seu nome"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#333399] focus:ring-2 focus:ring-[#7f5aff]/20"
                placeholder="voce@empresa.com"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Bairro</span>
              <select
                name="bairro"
                value={selectedBairroId}
                onChange={(event) => setSelectedBairroId(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#333399] focus:ring-2 focus:ring-[#7f5aff]/20"
              >
                {bairros.map((feature) => (
                  <option key={feature.properties.id} value={feature.properties.id}>
                    {feature.properties.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Mensagem</span>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#333399] focus:ring-2 focus:ring-[#7f5aff]/20"
                placeholder="Descreva a sua necessidade."
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#ff7400] px-4 text-sm font-medium text-white transition hover:bg-[#ff8a1f]"
            >
              Registrar contato
            </button>

            <div className="rounded-md bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedFeature?.properties.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {selectedFeature?.properties.zone} • CEP de referencia{" "}
                    {selectedFeature?.properties.postalCode}
                  </p>
                </div>
              </div>

              <pre className="mt-4 max-h-56 overflow-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-emerald-200">
                {selectedGeoJson}
              </pre>
            </div>

            {status ? <p className="text-sm text-[#333399]">{status}</p> : null}
          </form>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">Mapa do bairro selecionado</h2>
            <p className="mt-1 text-sm text-slate-600">
              Base gratuita com tiles do OpenStreetMap e GeoJSON local versionado no projeto.
            </p>
          </div>
          <BairroMap selectedFeature={selectedFeature} />
        </div>
      </section>
    </main>
  );
}
