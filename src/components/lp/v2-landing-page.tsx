"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { coverageBairros, painPoints, plans, stats } from "@/components/lp/lp-data";
import { LpSectionDivider } from "@/components/lp/lp-section-divider";
import { BairroFeature, saoLuisBairrosGeoJson } from "@/data/sao-luis-bairros";

const BairroMap = dynamic(() => import("@/components/bairro-map"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[220px] place-items-center bg-[#050914] text-sm font-bold text-cyan-100/75">
      Carregando mapa...
    </div>
  ),
});

type Lead = {
  bairro: string;
  cidade: string;
  rua: string;
  nome: string;
  whatsapp: string;
  available: boolean;
};

const steps = [
  ["Informe seu bairro", "Escolha uma das regioes com viabilidade no formulario."],
  ["Digite sua rua", "Com sua rua, conseguimos consultar melhor a disponibilidade."],
  ["O Starzinho te guia", "Depois da consulta, o atendimento segue pelo WhatsApp."],
  ["A ST1 confirma", "O time verifica se a instalacao pode avancar no seu endereco."],
  ["Orientacao do plano ideal", "O atendimento te ajuda a seguir com a melhor opcao."],
  ["Instalacao", "Se houver disponibilidade, voce recebe os proximos passos para ativacao."],
];

const purchaseFaqs = [
  [
    "Qual plano faz mais sentido para minha casa?",
    "O plano de 1000MB atende muito bem quem quer velocidade, estabilidade e bom custo-benefício. O de 1300MB é indicado para casas com mais pessoas, mais aparelhos conectados e uso mais intenso de internet.",
  ],
  [
    "Preciso escolher o plano agora?",
    "Não precisa decidir sozinho. Depois da consulta, o atendimento da ST1 te ajuda a confirmar a melhor opção para sua rotina.",
  ],
  [
    "A ST1 usa fibra óptica?",
    "Sim. A comunicação da ST1 reforça internet fibra com foco em velocidade, estabilidade e desempenho para a rotina residencial.",
  ],
  [
    "O atendimento continua por onde?",
    "O atendimento segue pelo WhatsApp, com os dados da sua consulta e o contexto do endereço informado.",
  ],
];

const planHighlights = {
  "1000MB": {
    eyebrow: "Essencial para rotina conectada",
    audience: "Ideal para navegação, trabalho remoto, estudos, streaming e jogos com ótimo custo-benefício.",
    devices: "Casa conectada",
    speedNote: "1 Giga de fibra",
    benefit: "Equilíbrio entre velocidade e preço",
    popular: false,
  },
  "1300MB": {
    eyebrow: "Mais folga para uso intenso",
    audience: "Perfeito para muitos aparelhos, vídeos em alta definição, chamadas, jogos e downloads ao mesmo tempo.",
    devices: "Mais dispositivos",
    speedNote: "1.3 Giga de fibra",
    benefit: "Mais performance por R$ 20 a mais",
    popular: true,
  },
} as const;

type BairroDropdownPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
};

function normalizeBairroName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeSearchText(value: string) {
  return normalizeBairroName(value)
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugifyBairroName(value: string) {
  return normalizeBairroName(value)
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashString(value: string) {
  return [...value].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0);
}

function getApproximateBairroCentroid(name: string, city: string): [number, number] {
  const normalizedName = normalizeBairroName(name);
  const normalizedCity = normalizeBairroName(city);

  const anchors: Array<[string[], [number, number]]> = [
    [["anjo da guarda", "fumace", "vila embratel", "mauro fecury", "vila nova", "paraiso"], [-44.327, -2.565]],
    [["coroadinho", "bom jesus", "vila conceicao", "vila dos nobres"], [-44.285, -2.56]],
    [["tirirical", "sao cristovao", "jardim sao cristovao", "sao raimundo", "santa efigenia"], [-44.228, -2.575]],
    [["forquilha", "cohab", "cohatrac", "maioba", "maiobinha", "jardim america"], [-44.205, -2.545]],
    [["anil", "joao de deus", "cruzeiro do anil", "aurora", "pirapora"], [-44.24, -2.555]],
    [["turu", "olho dagua", "divineia", "vila luizao", "aracagy", "vicente fialho"], [-44.215, -2.505]],
    [["cohama", "bequimao", "vinhais", "maranhao novo", "cohafuma", "angelim"], [-44.255, -2.515]],
    [["calhau", "renascenca", "sao francisco", "ilhinha", "ponta do farol"], [-44.285, -2.5]],
    [["liberdade", "camboa", "monte castelo", "fatima", "areinha", "fe em deus"], [-44.293, -2.54]],
    [["cidade olimpica", "cidade operaria", "geniparana", "jardim tropical"], [-44.17, -2.575]],
    [["maracana", "tibiri", "vila esperanca"], [-44.22, -2.63]],
  ];

  const matchedAnchor = anchors.find(([keywords]) => keywords.some((keyword) => normalizedName.includes(keyword)))?.[1];

  const cityAnchor =
    matchedAnchor ??
    (normalizedCity.includes("raposa")
      ? ([-44.105, -2.425] as [number, number])
      : normalizedCity.includes("paco")
        ? ([-44.13, -2.525] as [number, number])
        : normalizedCity.includes("ribamar")
          ? ([-44.075, -2.56] as [number, number])
          : ([-44.245, -2.535] as [number, number]));

  const hash = hashString(`${name}-${city}`);
  const lngOffset = (((hash % 17) - 8) / 1000) * 1.8;
  const latOffset = ((((hash >>> 5) % 17) - 8) / 1000) * 1.8;

  return [cityAnchor[0] + lngOffset, cityAnchor[1] + latOffset];
}

function createApproximateBairroFeature({
  id,
  name,
  city,
}: {
  id: string;
  name: string;
  city: string;
}): BairroFeature {
  const centroid = getApproximateBairroCentroid(name, city);
  const [lng, lat] = centroid;
  const radiusKm = 1.15;
  const lngDelta = 0.012;
  const latDelta = 0.010;

  return {
    type: "Feature",
    properties: {
      id,
      name,
      zone: city,
      postalCode: "São Luís e região",
      centroid,
      radiusKm,
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [lng - lngDelta, lat - latDelta],
        [lng + lngDelta, lat - latDelta],
        [lng + lngDelta, lat + latDelta],
        [lng - lngDelta, lat + latDelta],
        [lng - lngDelta, lat - latDelta],
      ]],
    },
  };
}

export default function V2LandingPage() {
  const consultationFormRef = useRef<HTMLDivElement | null>(null);
  const streetInputRef = useRef<HTMLInputElement | null>(null);
  const modalStreetInputRef = useRef<HTMLInputElement | null>(null);
  const bairroPickerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const bairroDropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedBairroId, setSelectedBairroId] = useState("");
  const [bairroSearch, setBairroSearch] = useState("");
  const [isBairroPickerOpen, setIsBairroPickerOpen] = useState(false);
  const [activeBairroPickerId, setActiveBairroPickerId] = useState<string | null>(null);
  const [bairroDropdownPosition, setBairroDropdownPosition] = useState<BairroDropdownPosition | null>(null);
  const [rua, setRua] = useState("");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [lead, setLead] = useState<Lead | null>(null);
  const [status, setStatus] = useState("");
  const [isLoadingCoverage, setIsLoadingCoverage] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orderedBairros = useMemo(
    () =>
      [...coverageBairros].sort(
        (first, second) =>
          first.name.localeCompare(second.name, "pt-BR", { sensitivity: "base" }) ||
          first.city.localeCompare(second.city, "pt-BR", { sensitivity: "base" }),
      ),
    [],
  );
  const filteredBairros = useMemo(() => {
    const query = normalizeSearchText(bairroSearch);

    if (!query) {
      return orderedBairros;
    }

    const queryTerms = query.split(/\s+/).filter(Boolean);

    return orderedBairros.filter((bairro) => {
      const searchableText = normalizeSearchText(`${bairro.name} ${bairro.city}`);

      return queryTerms.every((term) => searchableText.includes(term));
    });
  }, [bairroSearch, orderedBairros]);
  const selectedBairro = coverageBairros.find((bairro) => bairro.id === selectedBairroId);
  const selectedFeature = useMemo(
    () => {
      if (!selectedBairro) {
        return null;
      }

      const matchedFeature = saoLuisBairrosGeoJson.features.find((feature) => {
        const selectedName = selectedBairro?.name ?? "";
        const selectedSlug = slugifyBairroName(selectedName);
        const featureSlug = slugifyBairroName(feature.properties.name);

        return (
          feature.properties.id === selectedBairroId ||
          feature.properties.id === selectedSlug ||
          featureSlug === selectedSlug ||
          selectedSlug.startsWith(`${feature.properties.id}-`) ||
          selectedSlug.startsWith(`${featureSlug}-`)
        );
      });

      return matchedFeature ?? createApproximateBairroFeature(selectedBairro);
    },
    [selectedBairro, selectedBairroId],
  );

  const resultCopy = lead?.available
    ? {
        eyebrow: "Resultado da consulta",
        title: "Planos disponíveis para escolher agora",
        cardTitle: "Endereço em análise",
        cardText: `Um atendente confirma a disponibilidade final pelo WhatsApp ${lead.whatsapp}.`,
        nextTitle: "Seu endereço já entrou na análise da ST1.",
        nextText: `O atendimento continua pelo WhatsApp ${lead.whatsapp}. O time confirma a disponibilidade final e te ajuda a seguir com o plano ideal para sua casa.`,
      }
    : {
        eyebrow: "Bairro em construção",
        title: "Em breve disponível no seu bairro",
        cardTitle: "Rota em construção",
        cardText: `A ST1 ainda está construindo a rota em ${lead?.bairro}. Deixamos seu contato para avisar pelo WhatsApp ${lead?.whatsapp} quando houver disponibilidade.`,
        nextTitle: "A ST1 ainda está chegando ao seu bairro.",
        nextText:
          "Enquanto a cobertura é construída, você já pode conhecer os planos residenciais. Assim que a rota estiver disponível, o atendimento avança com a confirmação do endereço.",
      };

  function updateBairroDropdownPosition(pickerId: string) {
    const picker = bairroPickerRefs.current[pickerId];

    if (!picker) {
      return;
    }

    const rect = picker.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const gap = 8;
    const viewportPadding = 12;
    const availableBelow = viewportHeight - rect.bottom - viewportPadding;
    const availableAbove = rect.top - viewportPadding;
    const shouldOpenAbove = availableBelow < 260 && availableAbove > availableBelow;
    const availableHeight = shouldOpenAbove ? availableAbove : availableBelow;
    const maxHeight = Math.max(220, Math.min(380, availableHeight - gap));
    const width = Math.min(rect.width, viewportWidth - viewportPadding * 2);
    const left = Math.min(Math.max(rect.left, viewportPadding), viewportWidth - width - viewportPadding);
    const top = shouldOpenAbove
      ? Math.max(viewportPadding, rect.top - maxHeight - gap)
      : Math.min(rect.bottom + gap, viewportHeight - maxHeight - viewportPadding);

    setBairroDropdownPosition({
      left,
      top,
      width,
      maxHeight,
    });
  }

  function openBairroPicker(pickerId: string) {
    setActiveBairroPickerId(pickerId);
    setIsBairroPickerOpen(true);

    window.requestAnimationFrame(() => {
      updateBairroDropdownPosition(pickerId);
    });
  }

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      modalStreetInputRef.current?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timeoutId);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const clickedPicker = Object.values(bairroPickerRefs.current).some((element) => element?.contains(target));
      const clickedDropdown = bairroDropdownRef.current?.contains(target);

      if (!clickedPicker && !clickedDropdown) {
        setIsBairroPickerOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!isBairroPickerOpen || !activeBairroPickerId) {
      return;
    }

    const pickerId = activeBairroPickerId;

    function handleViewportChange() {
      updateBairroDropdownPosition(pickerId);
    }

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [activeBairroPickerId, isBairroPickerOpen]);

  function openConsultationModal() {
    setStatus("");
    setIsModalOpen(true);
  }

  function resetAfterBairroChange(bairroId: string) {
    setSelectedBairroId(bairroId);
    setRua("");
    setNome("");
    setWhatsapp("");
    setLead(null);
    setStatus("");
    setIsLoadingCoverage(false);
    setIsSubmittingLead(false);
    setShowResults(false);

    if (!bairroId) {
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
      return;
    }

    window.setTimeout(() => {
      consultationFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      streetInputRef.current?.focus();
    }, 0);
  }

  function selectBairro(bairroId: string) {
    const bairro = coverageBairros.find((item) => item.id === bairroId);

    setBairroSearch(bairro ? `${bairro.name} - ${bairro.city}` : "");
    setIsBairroPickerOpen(false);
    resetAfterBairroChange(bairroId);
  }

  async function handleAvailabilitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingLead) {
      return;
    }

    if (!selectedBairro) {
      setStatus("Selecione um bairro para continuar.");
      return;
    }

    if (rua.trim().length < 3) {
      setStatus("Digite o nome da rua para consultar.");
      return;
    }

    if (nome.trim().length < 3) {
      setStatus("Digite seu nome completo.");
      return;
    }

    if (whatsapp.trim().length < 8) {
      setStatus("Digite um WhatsApp válido.");
      return;
    }

    const nextLead = {
      bairro: selectedBairro.name,
      cidade: selectedBairro.city,
      rua: rua.trim(),
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      available: selectedBairro.available,
    };

    setIsSubmittingLead(true);
    setStatus("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...nextLead,
          source: "lp-v2",
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      setLead(nextLead);
      setIsLoadingCoverage(true);
      setShowResults(false);

      window.setTimeout(() => {
        setIsLoadingCoverage(false);
        setIsModalOpen(false);
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1200);
    } catch {
      setStatus("Não consegui enviar seus dados agora. Tente novamente em instantes.");
    } finally {
      setIsSubmittingLead(false);
    }
  }

  function renderConsultationForm(isModal = false) {
    if (!selectedBairro) {
      return null;
    }

    return (
      <form onSubmit={handleAvailabilitySubmit} className="grid gap-5 p-4 text-left sm:p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#050914]">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-black text-white">{selectedBairro.name}</p>
            <p className="mt-1 text-xs leading-5 text-cyan-100/75">{selectedBairro.text}</p>
          </div>
          <BairroMap selectedFeature={selectedFeature} variant="dark" size="compact" />
        </div>

        <div className="grid content-start gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-100">Dados da consulta</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
              Verifique a disponibilidade na sua rua
            </h2>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-cyan-100">Rua</span>
            <input
              name="rua"
              ref={isModal ? modalStreetInputRef : streetInputRef}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-cyan-100">Nome</span>
              <input
                name="nome"
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value);
                  setStatus("");
                }}
                placeholder="Seu nome"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-4 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-cyan-100">WhatsApp</span>
              <input
                name="whatsapp"
                value={whatsapp}
                onChange={(event) => {
                  setWhatsapp(event.target.value);
                  setStatus("");
                }}
                inputMode="tel"
                placeholder="(98) 90000-0000"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-4 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                required
              />
            </label>
          </div>

          {status ? <p className="text-sm leading-6 text-[#ff7400]">{status}</p> : null}

          <button
            type="submit"
            disabled={isSubmittingLead}
            className="w-full rounded-2xl bg-[#ff7400] px-6 py-4 text-base font-black text-[#07111f] shadow-[0_0_34px_rgba(255,116,0,0.28)] transition hover:-translate-y-0.5"
          >
            {isSubmittingLead ? "Enviando consulta..." : "Verificar disponibilidade"}
          </button>
        </div>
      </form>
    );
  }

  function renderBairroPicker(pickerId: string) {
    const isCurrentPickerOpen = isBairroPickerOpen && activeBairroPickerId === pickerId;

    return (
      <div className="relative z-40 grid gap-3 text-left sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start">
        <span className="pt-1 text-sm font-black uppercase tracking-[0.2em] text-cyan-100 sm:pt-4">Bairro</span>
        <div
          ref={(element) => {
            bairroPickerRefs.current[pickerId] = element;
          }}
          className="relative"
        >
          <div className="relative">
            <input
              type="search"
              role="combobox"
              aria-expanded={isCurrentPickerOpen}
              aria-controls={`${pickerId}-options`}
              aria-autocomplete="list"
              value={bairroSearch}
              onFocus={() => openBairroPicker(pickerId)}
              onChange={(event) => {
                setBairroSearch(event.target.value);
                openBairroPicker(pickerId);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsBairroPickerOpen(false);
                  return;
                }

                if (event.key === "Enter" && filteredBairros[0]) {
                  event.preventDefault();
                  selectBairro(filteredBairros[0].id);
                }
              }}
              placeholder="Digite para buscar seu bairro"
              className="w-full rounded-2xl border border-white/10 bg-[#050914] px-4 py-4 pr-24 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
            />
            {bairroSearch ? (
              <button
                type="button"
                aria-label="Limpar busca de bairro"
                onClick={() => {
                  setBairroSearch("");
                  setSelectedBairroId("");
                  setRua("");
                  setNome("");
                  setWhatsapp("");
                  setLead(null);
                  setStatus("");
                  setShowResults(false);
                  openBairroPicker(pickerId);
                }}
                className="absolute right-12 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-cyan-100 transition hover:bg-white/10"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            ) : null}
            <button
              type="button"
              aria-label={isCurrentPickerOpen ? "Fechar bairros" : "Abrir bairros"}
              onClick={() => {
                if (isCurrentPickerOpen) {
                  setIsBairroPickerOpen(false);
                  return;
                }

                openBairroPicker(pickerId);
              }}
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-cyan-100 transition hover:bg-white/10"
            >
              <span className={`h-2 w-2 rotate-45 border-b-2 border-r-2 transition ${isCurrentPickerOpen ? "rotate-[225deg]" : ""}`} />
            </button>
          </div>

          {isCurrentPickerOpen && bairroDropdownPosition && typeof document !== "undefined"
            ? createPortal(
                <div
                  ref={bairroDropdownRef}
                  id={`${pickerId}-options`}
                  role="listbox"
                  style={{
                    left: bairroDropdownPosition.left,
                    top: bairroDropdownPosition.top,
                    width: bairroDropdownPosition.width,
                    maxHeight: bairroDropdownPosition.maxHeight,
                    WebkitOverflowScrolling: "touch",
                  }}
                  className="fixed z-[9999] overflow-y-auto overscroll-contain rounded-2xl border border-cyan-200/20 bg-[#050914] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.72)] ring-1 ring-white/10"
                >
                  <div className="sticky top-0 z-10 mb-1 border-b border-white/10 bg-[#050914]/95 px-3 py-2 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
                      {filteredBairros.length === 1 ? "1 bairro encontrado" : `${filteredBairros.length} bairros encontrados`}
                    </p>
                  </div>
                  {filteredBairros.length > 0 ? (
                    <div className="grid gap-1">
                      {filteredBairros.map((bairro) => {
                        const isSelected = bairro.id === selectedBairroId;

                        return (
                          <button
                            key={bairro.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => selectBairro(bairro.id)}
                            className={`w-full rounded-xl px-3 py-3 text-left transition active:scale-[0.99] ${
                              isSelected
                                ? "bg-cyan-300 text-[#04101f] shadow-[0_0_22px_rgba(103,232,249,0.20)]"
                                : "text-slate-100 hover:bg-cyan-300/10 hover:text-white"
                            }`}
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-black">{bairro.name}</span>
                                <span
                                  className={`mt-1 block truncate text-xs ${
                                    isSelected ? "text-[#04101f]/70" : "text-cyan-100/70"
                                  }`}
                                >
                                  {bairro.city}
                                </span>
                              </span>
                              {isSelected ? <span className="text-sm font-black">Selecionado</span> : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="px-3 py-4 text-sm font-bold text-[#ff7400]">Nenhum bairro encontrado.</p>
                  )}
                </div>,
                document.body,
              )
            : null}

        </div>
      </div>
    );
  }

  if (isLoadingCoverage) {
    return (
      <main className="lp-animated grid min-h-screen place-items-center bg-[#050914] px-5 py-16 text-white sm:px-8 lg:px-12">
        <section className="w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-[#07111f] p-8 text-center shadow-2xl">
          <div className="mx-auto size-16 animate-spin rounded-full border-4 border-cyan-300/20 border-t-cyan-200" />
          <h1 className="mt-6 text-3xl font-black tracking-[-0.05em] text-white">Consultando rota da ST1...</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Estamos verificando o bairro, a rua e preparando os planos residenciais para sua consulta.
          </p>
        </section>
      </main>
    );
  }

  if (showResults) {
    return (
      <main className="lp-animated min-h-screen overflow-hidden bg-[#050914] text-white">
        <section className="relative isolate min-h-screen px-5 py-6 sm:px-8 lg:px-12">
          <div className="lp-gradient-shift absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(0,148,255,0.32),transparent_34%),radial-gradient(circle_at_86%_14%,rgba(255,116,0,0.26),transparent_30%),linear-gradient(135deg,#050914_0%,#07182c_52%,#080b12_100%)]" />

          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="#topo" className="flex items-center gap-3" aria-label="ST1 Internet">
              <Image
                src="/logo-ST1-03%201.png"
                alt="ST1 Internet"
                width={453}
                height={327}
                className="h-auto w-[58px] sm:w-[68px]"
              />
            </a>
            <button
              type="button"
              onClick={() => {
                setShowResults(false);
                setLead(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-full border border-cyan-200/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-extrabold text-cyan-50 transition hover:bg-cyan-300 hover:text-[#04101f]"
            >
              Nova consulta
            </button>
          </div>

          <div className="mx-auto mt-12 max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-stretch">
              <div className="order-1 lg:col-start-1 lg:row-start-1">
                <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">{resultCopy.eyebrow}</p>
                {lead?.available ? (
                  <span className="mt-5 inline-flex rounded-full border border-emerald-200/50 bg-emerald-300/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 shadow-[0_0_26px_rgba(110,231,183,0.18)]">
                    Disponível
                  </span>
                ) : null}
                <h1 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl">
                  {resultCopy.title}
                </h1>
              </div>

              <div
                id="planos"
                className="order-2 grid gap-5 pt-4 md:grid-cols-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full"
              >
                {plans.map((plan) => {
                  const highlight = planHighlights[plan.name as keyof typeof planHighlights];

                  return (
                    <article
                      key={plan.name}
                      className={`relative flex min-h-[620px] flex-col overflow-visible rounded-[2rem] border p-5 shadow-2xl transition hover:-translate-y-1 sm:p-6 lg:h-full ${
                        highlight?.popular
                          ? "border-[#ff7400]/70 bg-[radial-gradient(circle_at_30%_0%,rgba(255,116,0,0.34),transparent_34%),linear-gradient(160deg,#12233d_0%,#07111f_64%,#050914_100%)] shadow-[0_26px_80px_rgba(255,116,0,0.18)]"
                          : "border-white/10 bg-[linear-gradient(160deg,#081629_0%,#06101f_100%)]"
                      }`}
                    >
                      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-cyan-300/12 blur-2xl" />
                      {highlight?.popular ? (
                        <div className="absolute right-6 top-0 z-10 -translate-y-1/2 rounded-full border border-[#ffb06a]/80 bg-[#ff7400] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#170a02] shadow-[0_0_28px_rgba(255,116,0,0.45)]">
                          Mais popular
                        </div>
                      ) : null}

                      <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff7400]">
                          {highlight?.eyebrow ?? plan.label}
                        </p>
                        <div className="mt-6 flex items-end justify-between gap-4">
                          <div>
                            <h2 className="text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
                              {plan.name}
                            </h2>
                            <p className="mt-2 text-sm font-bold text-cyan-100">{highlight?.speedNote}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-right">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-cyan-100">Perfil</p>
                            <p className="mt-1 text-sm font-black text-white">{highlight?.devices}</p>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-7 rounded-[1.5rem] border border-white/10 bg-[#050914]/70 p-4">
                        <p className="text-sm font-bold text-slate-300">A partir de</p>
                        <p className="mt-1 text-3xl font-black tracking-[-0.04em] text-cyan-100">{plan.price}</p>
                        <p className="mt-3 text-sm font-black text-[#ff7400]">{highlight?.benefit}</p>
                      </div>

                      <p className="relative mt-5 text-sm leading-6 text-slate-300">
                        {highlight?.audience ?? plan.description}
                      </p>

                      <ul className="relative mb-8 mt-6 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-100">
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-cyan-200 text-[11px] font-black text-[#06101f]">
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <a
                        href="#proximos-passos"
                        className={`relative mt-auto inline-flex w-full justify-center rounded-2xl px-5 py-4 text-base font-black transition hover:-translate-y-0.5 ${
                          highlight?.popular
                            ? "bg-[#ff7400] text-[#170a02] shadow-[0_0_34px_rgba(255,116,0,0.32)]"
                            : "bg-gradient-to-r from-cyan-200 to-white text-[#07111f]"
                        }`}
                      >
                        {highlight?.popular ? "Quero o mais popular" : "Quero este plano"}
                      </a>
                    </article>
                  );
                })}
              </div>

              <div className="order-3 lg:col-start-1 lg:row-start-2">
                <div className="lp-motion-card overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] lg:mt-6">
                  <div className="p-5 pb-0">
                    <p className="text-sm font-bold text-cyan-100">{resultCopy.cardTitle}</p>
                    <p className="mt-2 text-lg font-black text-white">
                      {lead?.bairro}, {lead?.rua}
                    </p>
                    {lead?.available ? (
                      <span className="mt-3 inline-flex rounded-full bg-emerald-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#042015]">
                        Disponível
                      </span>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {resultCopy.cardText}
                    </p>
                  </div>
                  <div className="relative mt-5 aspect-square overflow-hidden lg:aspect-auto lg:h-[355px]">
                    <Image
                      src="/starzinho no note.png"
                      alt="Starzinho acompanhando a analise do endereco"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="lp-float object-contain lg:object-cover lg:object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff7400]">Chega de conexão instável</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                Internet para trabalhar, estudar, jogar e assistir sem depender da sorte.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Sua rotina precisa de uma conexão que aguente vários aparelhos, chamadas de vídeo, streaming e jogos
                online ao mesmo tempo.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {painPoints.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-cyan-200/30"
                >
                  <span className="lp-pulse-dot mb-5 block size-3 rounded-full bg-[#ff7400] shadow-[0_0_22px_#ff7400]" />
                  <h3 className="text-lg font-black tracking-[-0.03em] text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">Por que avançar agora</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                A ST1 entrega fibra para uma rotina residencial cada vez mais conectada.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                A escolha do plano pode ser simples: 1000MB para velocidade e custo-benefício, 1300MB para quem quer
                mais folga em casas com uso intenso.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {stats.map(([title, text]) => (
                  <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
                    <h3 className="text-lg font-black tracking-[-0.03em] text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid min-h-[360px] place-items-center lg:min-h-[520px]">
              <Image
                src="/starzinho-no-rocket.png"
                alt="Starzinho voando em um foguete com notebook"
                width={1254}
                height={1254}
                className="lp-float h-auto w-full max-w-[520px] object-contain"
              />
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff7400]">Antes de escolher</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Dúvidas comuns antes de contratar
            </h2>
            <div className="mt-10 divide-y divide-white/10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055]">
              {purchaseFaqs.map(([question, answer]) => (
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

        <section id="proximos-passos" className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-[#ff7400]/25 bg-[radial-gradient(circle_at_20%_20%,rgba(255,116,0,0.26),transparent_30%),linear-gradient(135deg,#07182c,#050914)] p-8 text-center sm:p-12">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff7400]">Próximo passo</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              {resultCopy.nextTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              {resultCopy.nextText}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
      <main className="lp-animated min-h-screen overflow-hidden bg-[#050914] text-white">
      <section className="relative isolate px-5 pb-0 pt-6 sm:px-8 lg:px-12">
        <div className="lp-gradient-shift absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(0,148,255,0.36),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(255,116,0,0.30),transparent_32%),linear-gradient(135deg,#050914_0%,#07182c_52%,#080b12_100%)] [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-b from-transparent via-[#050914]/70 to-[#050914]" />
        <div className="absolute left-1/2 top-28 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-3xl [mask-image:linear-gradient(to_bottom,black_0%,transparent_78%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_78%)]" />

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#topo" className="flex items-center gap-3" aria-label="ST1 Internet">
            <Image
              src="/logo-ST1-03%201.png"
              alt="ST1 Internet"
              width={453}
              height={327}
              className="h-auto w-[58px] sm:w-[68px]"
            />
          </a>
          <button
            type="button"
            onClick={openConsultationModal}
            className="rounded-full border border-[#ff7400]/45 bg-[#ff7400] px-5 py-2.5 text-sm font-extrabold text-[#120804] shadow-[0_0_32px_rgba(255,116,0,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ff8a1f]"
          >
            Consultar rua
          </button>
        </div>

        <div id="topo" className="mx-auto flex max-w-5xl flex-col items-center pt-14 text-center lg:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
            <span className="lp-pulse-dot size-2 rounded-full bg-[#ff7400] shadow-[0_0_18px_#ff7400]" />
            Internet Fibra Ótica em São Luiz e Região
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            Descubra se a fibra da ST1
            <span className="block bg-gradient-to-r from-cyan-200 via-white to-[#ff7400] bg-clip-text text-transparent">
              chega na sua rua.
            </span>
          </h1>
        </div>

        <div id="consulta" ref={consultationFormRef} className="mx-auto mt-10 max-w-5xl">
          <div className="lp-motion-card overflow-visible rounded-[2rem] border border-white/12 bg-[#07111f]/90 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur">
            <div className="border-b border-white/10 bg-cyan-300/10 p-4 sm:p-5">
              {renderBairroPicker("bairro-picker-main")}
            </div>

            {selectedBairro ? renderConsultationForm() : null}
          </div>
        </div>

        <div className="mx-auto mt-5 flex max-w-5xl items-start gap-3 text-left sm:gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-[#ff7400] bg-[#07111f] shadow-[0_0_34px_rgba(255,116,0,0.32)] sm:size-24">
            <Image
              src="/perfil-starzinho.png"
              alt="Starzinho"
              width={301}
              height={301}
              priority
              className="lp-float h-full w-full object-cover"
            />
          </div>
          <div className="relative flex-1 rounded-2xl rounded-tl-sm border border-white/20 bg-white/82 px-5 py-4 text-[#07111f] shadow-[0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur before:absolute before:left-[-8px] before:top-7 before:size-4 before:rotate-45 before:border-b before:border-l before:border-white/20 before:bg-white/82 sm:px-6 sm:py-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#072f78]">Starzinho</p>
            <p className="mt-1 text-base font-semibold leading-7 sm:text-lg">
              Informe seu bairro e sua rua no formulário acima. Eu consulto a disponibilidade da ST1 e te mostro as
              ofertas disponíveis para o seu endereço.
            </p>
          </div>
        </div>

        <LpSectionDivider className="mt-10" />
      </section>

      <section className="relative px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff7400]">Chega de conexão instável</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Internet para trabalhar, estudar, jogar e assistir sem depender da sorte.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Sua rotina precisa de uma conexão que aguente vários aparelhos, chamadas de vídeo, streaming e jogos
              online ao mesmo tempo.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {painPoints.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-cyan-200/30"
              >
                <span className="lp-pulse-dot mb-5 block size-3 rounded-full bg-[#ff7400] shadow-[0_0_22px_#ff7400]" />
                <h3 className="text-lg font-black tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="lp-motion-card mx-auto max-w-7xl rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(0,148,255,0.12),rgba(255,116,0,0.10))] p-6 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff7400]">Consulta de cobertura</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Como funciona a consulta com o Starzinho
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Em poucos passos, voce descobre se a ST1 ja pode chegar ate sua rua.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(([title, text], index) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-[#050914]/60 p-5">
                <span className="grid size-11 place-items-center rounded-2xl bg-white text-sm font-black text-[#072f78]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-black tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="lp-gradient-shift lp-motion-card mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-[#ff7400]/25 bg-[radial-gradient(circle_at_20%_20%,rgba(255,116,0,0.26),transparent_30%),linear-gradient(135deg,#07182c,#050914)] p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Quer saber se essa rota chega ate sua rua?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Informe seu bairro e sua rua para consultar a disponibilidade da ST1 pelo WhatsApp.
          </p>
          <button
            type="button"
            onClick={openConsultationModal}
            className="mt-8 inline-flex rounded-full bg-[#ff7400] px-8 py-4 font-black text-[#07111f] transition hover:-translate-y-0.5"
          >
            Verificar minha rua
          </button>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020611]/80 px-4 py-6 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-5xl overflow-visible rounded-[2rem] border border-white/12 bg-[#07111f]/95 shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-100">Consulta de cobertura</p>
                <p className="mt-1 text-lg font-black text-white">Preencha seus dados para verificar a disponibilidade</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-black text-cyan-100 transition hover:bg-white/10"
              >
                Fechar
              </button>
            </div>

            <div className="border-b border-white/10 bg-cyan-300/10 p-4 sm:p-5">
              {renderBairroPicker("bairro-picker-modal")}
            </div>

            <div className="max-h-[calc(100vh-13rem)] overflow-y-auto">
              {selectedBairro ? renderConsultationForm(true) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
