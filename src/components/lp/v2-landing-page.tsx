"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { benefitPoints, coverageBairros, plans, stats } from "@/components/lp/lp-data";
import { BairroFeature, saoLuisBairrosGeoJson } from "@/data/sao-luis-bairros";

const BairroMap = dynamic(() => import("@/components/bairro-map"), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-[220px] place-items-center bg-[#232878] text-sm font-bold text-white/80/75">
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
  ["Informe seu bairro", "Escolha uma das regiões com viabilidade no formulário."],
  ["Digite sua rua", "Com sua rua, conseguimos consultar melhor a disponibilidade."],
  ["O Starzinho te guia", "Depois da consulta, o atendimento segue pelo WhatsApp."],
  ["A ST1 Internet confirma", "O time verifica se a instalação pode avançar no seu endereço."],
  ["Orientação do plano ideal", "O atendimento te ajuda a seguir com a melhor opção."],
  ["Instalação", "Se houver disponibilidade, você recebe os próximos passos para ativação."],
];

const purchaseFaqs = [
  [
    "Qual plano faz mais sentido para minha casa?",
    "O plano de 1000MB atende muito bem quem quer velocidade, estabilidade e bom custo-benefício. O de 1300MB é indicado para casas com mais pessoas, mais aparelhos conectados e uso mais intenso de internet.",
  ],
  [
    "Preciso escolher o plano agora?",
    "Não precisa decidir sozinho. Depois da consulta, o atendimento da ST1 Internet te ajuda a confirmar a melhor opção para sua rotina.",
  ],
  [
    "A ST1 Internet usa fibra óptica?",
    "Sim. A comunicação da ST1 Internet reforça internet fibra com foco em velocidade, estabilidade e desempenho para a rotina residencial.",
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

const streamingHighlights = ["4K HDR", "Áudio imersivo", "Zero delay", "Multi-device"] as const;

const streamingPlatforms = ["NETFLIX", "prime video", "Disney+", "MAX", "Globoplay", "YouTube", "STAR+"] as const;

const landingMenuItems = [
  { href: "#topo", label: "Início" },
  { href: "#consulta", label: "Consulta" },
  { href: "#streaming", label: "Streaming" },
  { href: "#st1", label: "ST1 Internet" },
  { href: "#duvidas", label: "Dúvidas" },
] as const;

const resultMenuItems = [
  { href: "#topo", label: "Início" },
  { href: "#planos", label: "Planos" },
  { href: "#proximos-passos", label: "Próximo passo" },
] as const;

function BenefitIcon({ title }: { title: string }) {
  const iconClassName = "size-6";

  switch (title) {
    case "Trabalho remoto sem cair":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="11" rx="2" />
          <path d="M8 20h8" />
          <path d="M12 16v4" />
          <path d="M8 9h.01" />
          <path d="M12 9h.01" />
          <path d="M16 9h.01" />
        </svg>
      );
    case "Maratona sem travar":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m10 9 5 3-5 3V9z" />
          <path d="M6 3v2" />
          <path d="M18 3v2" />
        </svg>
      );
    case "Game sem lag":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 12h4" />
          <path d="M8 10v4" />
          <path d="M15 13h.01" />
          <path d="M18 11h.01" />
          <path d="M7 18h10a4 4 0 0 0 3.8-5.25l-1.2-3.7A4 4 0 0 0 15.8 6H8.2a4 4 0 0 0-3.8 3.05l-1.2 3.7A4 4 0 0 0 7 18Z" />
        </svg>
      );
    case "Wi-Fi na casa toda":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13a10 10 0 0 1 14 0" />
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <path d="M12 20h.01" />
          <path d="M3 9a14 14 0 0 1 18 0" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClassName} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
        </svg>
      );
  }
}

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

function FloatingHeader({
  menuItems,
  ctaLabel,
  onCtaClick,
  visible,
}: {
  menuItems: ReadonlyArray<{ href: string; label: string }>;
  ctaLabel: string;
  onCtaClick: () => void;
  visible: boolean;
}) {
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-4 z-40 px-4 transition duration-300 sm:px-6 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/20 bg-[#2B3094]/92 px-3 py-3 shadow-[0_24px_70px_rgba(43,48,148,0.28)] backdrop-blur-xl sm:px-4">
        <a href="#topo" className="pointer-events-auto flex shrink-0 items-center gap-3 rounded-full px-2 py-1" aria-label="ST1 Internet">
          <Image
            src="/logo-ST1-03%201.png"
            alt="ST1 Internet"
            width={453}
            height={327}
            className="h-auto w-[42px] sm:w-[50px]"
          />
        </a>

        <nav aria-label="Secoes da pagina" className="hidden min-w-0 flex-1 justify-center md:flex">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="pointer-events-auto inline-flex rounded-full px-4 py-2 text-sm font-bold text-white/88 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={onCtaClick}
          className="lp-magnetic-cta pointer-events-auto shrink-0 rounded-full border border-[#F18721]/40 bg-[#F18721] px-4 py-2 text-sm font-extrabold text-white shadow-[0_0_32px_rgba(241,135,33,0.32)] transition hover:-translate-y-0.5 hover:bg-[#f59a45] sm:px-5 sm:py-2.5"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cursorElement = cursor;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let animationFrameId = 0;

    function moveCursor() {
      currentX += (targetX - currentX) * 0.45;
      currentY += (targetY - currentY) * 0.45;
      cursorElement.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      animationFrameId = window.requestAnimationFrame(moveCursor);
    }

    function handlePointerMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorElement.classList.add("is-visible");
    }

    function handlePointerOver(event: PointerEvent) {
      const target = event.target as Element | null;
      const isInteractive = target?.closest("a, button, input, select, textarea, summary, [role='button'], [role='option']");

      cursorElement.classList.toggle("is-hovering", Boolean(isInteractive));
    }

    function handlePointerDown() {
      cursorElement.classList.add("is-pressed");
    }

    function handlePointerUp() {
      cursorElement.classList.remove("is-pressed");
    }

    function handlePointerLeave() {
      cursorElement.classList.remove("is-visible", "is-hovering", "is-pressed");
    }

    animationFrameId = window.requestAnimationFrame(moveCursor);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return <div ref={cursorRef} className="lp-cursor" aria-hidden="true" />;
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
  const [isFloatingHeaderVisible, setIsFloatingHeaderVisible] = useState(true);

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
        nextTitle: "Seu endereço já entrou na análise da ST1 Internet.",
        nextText: `O atendimento continua pelo WhatsApp ${lead.whatsapp}. O time confirma a disponibilidade final e te ajuda a seguir com o plano ideal para sua casa.`,
      }
    : {
        eyebrow: "Bairro em construção",
        title: "Em breve disponível no seu bairro",
        cardTitle: "Rota em construção",
        cardText: `A ST1 Internet ainda está construindo a rota em ${lead?.bairro}. Deixamos seu contato para avisar pelo WhatsApp ${lead?.whatsapp} quando houver disponibilidade.`,
        nextTitle: "A ST1 Internet ainda está chegando ao seu bairro.",
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
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const firstFoldHeight = window.innerHeight * 0.9;
      const scrollingUp = currentScrollY < lastScrollY;
      const shouldShow = currentScrollY <= firstFoldHeight || scrollingUp;

      setIsFloatingHeaderVisible(shouldShow);
      lastScrollY = currentScrollY;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".lp-animated section, .lp-animated article, .lp-animated .lp-card-interactive, .lp-animated .lp-motion-card, .lp-animated details, .lp-animated h1, .lp-animated h2",
      ),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    revealElements.forEach((element, index) => {
      element.classList.add("lp-reveal");
      element.style.setProperty("--lp-reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);

      if (reducedMotion) {
        element.classList.add("is-visible");
      }
    });

    if (reducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      revealElements.forEach((element) => {
        element.classList.remove("lp-reveal", "is-visible");
        element.style.removeProperty("--lp-reveal-delay");
      });
    };
  }, [showResults, isLoadingCoverage]);

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
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#232878]">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-black text-white">{selectedBairro.name}</p>
            <p className="mt-1 text-xs leading-5 text-white/80/75">{selectedBairro.text}</p>
          </div>
          <BairroMap selectedFeature={selectedFeature} variant="dark" size="compact" />
        </div>

        <div className="grid content-start gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Dados da consulta</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">
              Verifique a disponibilidade na sua rua
            </h2>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-white/80">Rua</span>
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
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#232878] px-4 py-4 text-white outline-none ring-[#F18721]/30 transition placeholder:text-slate-500 focus:border-[#F18721] focus:ring-4"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-white/80">Nome</span>
              <input
                name="nome"
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value);
                  setStatus("");
                }}
                placeholder="Seu nome"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#232878] px-4 py-4 text-white outline-none ring-[#F18721]/30 transition placeholder:text-slate-500 focus:border-[#F18721] focus:ring-4"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-white/80">WhatsApp</span>
              <input
                name="whatsapp"
                value={whatsapp}
                onChange={(event) => {
                  setWhatsapp(event.target.value);
                  setStatus("");
                }}
                inputMode="tel"
                placeholder="(98) 90000-0000"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#232878] px-4 py-4 text-white outline-none ring-[#F18721]/30 transition placeholder:text-slate-500 focus:border-[#F18721] focus:ring-4"
                required
              />
            </label>
          </div>

          {status ? <p className="text-sm leading-6 text-[#F18721]">{status}</p> : null}

          <button
            type="submit"
            disabled={isSubmittingLead}
            className="lp-magnetic-cta w-full rounded-2xl bg-[#F18721] px-6 py-4 text-base font-black text-white shadow-[0_0_34px_rgba(241,135,33,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
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
        <span className="pt-1 text-sm font-black uppercase tracking-[0.2em] text-white/80 sm:pt-4">Bairro</span>
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
              className="w-full rounded-2xl border border-white/10 bg-[#232878] px-4 py-4 pr-24 text-white outline-none ring-[#F18721]/30 transition placeholder:text-slate-500 focus:border-[#F18721] focus:ring-4"
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
                className="absolute right-12 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-white/80 transition hover:bg-white/10"
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
              className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-white/80 transition hover:bg-white/10"
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
                  className="fixed z-[9999] overflow-y-auto overscroll-contain rounded-2xl border border-white/20 bg-[#232878] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.72)] ring-1 ring-white/10"
                >
                  <div className="sticky top-0 z-10 mb-1 border-b border-white/10 bg-[#232878]/95 px-3 py-2 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/80">
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
                                ? "bg-white text-[#2B3094] shadow-[0_0_22px_rgba(255,255,255,0.20)]"
                                : "text-slate-100 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <span className="flex items-center justify-between gap-3">
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-black">{bairro.name}</span>
                                <span
                                  className={`mt-1 block truncate text-xs ${
                                    isSelected ? "text-[#2B3094]/70" : "text-white/70"
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
                    <p className="px-3 py-4 text-sm font-bold text-[#F18721]">Nenhum bairro encontrado.</p>
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
      <main className="lp-animated lp-custom-cursor grid min-h-screen place-items-center bg-[#2B3094] px-5 py-16 text-white sm:px-8 lg:px-12">
        <CustomCursor />
        <section className="w-full max-w-3xl rounded-[2.5rem] border border-white/15 bg-[#232878] p-8 text-center shadow-2xl">
          <div className="mx-auto size-16 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <h1 className="mt-6 text-3xl font-black tracking-[-0.05em] text-white">Consultando rota da ST1 Internet...</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Estamos verificando o bairro, a rua e preparando os planos residenciais para sua consulta.
          </p>
        </section>
      </main>
    );
  }

  if (showResults) {
    return (
      <main className="lp-animated lp-custom-cursor min-h-screen overflow-hidden bg-white text-[#2B3094]">
        <CustomCursor />
        <FloatingHeader
          menuItems={resultMenuItems}
          ctaLabel="Nova consulta"
          onCtaClick={() => {
            setShowResults(false);
            setLead(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          visible={isFloatingHeaderVisible}
        />
        <section className="relative isolate min-h-screen bg-[#2B3094] px-5 pb-6 pt-28 text-white sm:px-8 lg:px-12">
          <div className="lp-gradient-shift absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(241,135,33,0.22),transparent_34%),radial-gradient(circle_at_86%_14%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(135deg,#2B3094_0%,#232878_52%,#2B3094_100%)]" />

          <div className="mx-auto mt-4 max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-stretch">
              <div className="order-1 lg:col-start-1 lg:row-start-1">
                <p className="text-sm font-black uppercase tracking-[0.26em] text-white/90">{resultCopy.eyebrow}</p>
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
                className="scroll-mt-28 order-2 grid gap-5 pt-4 md:grid-cols-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full"
              >
                {plans.map((plan) => {
                  const highlight = planHighlights[plan.name as keyof typeof planHighlights];

                  return (
                    <article
                      key={plan.name}
                      className={`lp-card-interactive relative flex min-h-[620px] flex-col overflow-visible rounded-[2rem] border p-5 shadow-2xl transition sm:p-6 lg:h-full ${
                        highlight?.popular
                          ? "border-[#F18721]/70 bg-[radial-gradient(circle_at_30%_0%,rgba(241,135,33,0.34),transparent_34%),linear-gradient(160deg,#232878_0%,#2B3094_64%,#2B3094_100%)] shadow-[0_26px_80px_rgba(241,135,33,0.18)]"
                          : "border-white/15 bg-[linear-gradient(160deg,#232878_0%,#2B3094_100%)]"
                      }`}
                    >
                      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-white/12 blur-2xl" />
                      {highlight?.popular ? (
                        <div className="absolute right-6 top-0 z-10 -translate-y-1/2 rounded-full border border-[#f5a654]/80 bg-[#F18721] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#170a02] shadow-[0_0_28px_rgba(241,135,33,0.45)]">
                          Mais popular
                        </div>
                      ) : null}

                      <div className="relative">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F18721]">
                          {highlight?.eyebrow ?? plan.label}
                        </p>
                        <div className="mt-6 flex items-end justify-between gap-4">
                          <div>
                            <h2 className="text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl">
                              {plan.name}
                            </h2>
                            <p className="mt-2 text-sm font-bold text-white/80">{highlight?.speedNote}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-right">
                            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/80">Perfil</p>
                            <p className="mt-1 text-sm font-black text-white">{highlight?.devices}</p>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-7 rounded-[1.5rem] border border-white/10 bg-[#232878]/70 p-4">
                        <p className="text-sm font-bold text-slate-300">A partir de</p>
                        <p className="mt-1 text-3xl font-black tracking-[-0.04em] text-white/80">{plan.price}</p>
                        <p className="mt-3 text-sm font-black text-[#F18721]">{highlight?.benefit}</p>
                      </div>

                      <p className="relative mt-5 text-sm leading-6 text-slate-300">
                        {highlight?.audience ?? plan.description}
                      </p>

                      <ul className="relative mb-8 mt-6 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-slate-100">
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[11px] font-black text-[#2B3094]">
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <a
                        href="#proximos-passos"
                        className={`lp-magnetic-cta relative mt-auto inline-flex w-full justify-center rounded-2xl px-5 py-4 text-base font-black transition hover:-translate-y-0.5 ${
                          highlight?.popular
                            ? "bg-[#F18721] text-[#170a02] shadow-[0_0_34px_rgba(241,135,33,0.32)]"
                            : "bg-white text-[#2B3094]"
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
                    <p className="text-sm font-bold text-white/80">{resultCopy.cardTitle}</p>
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
                      alt="Starzinho acompanhando a análise do endereço"
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

        <section className="relative bg-white px-5 py-20 text-[#2B3094] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.26em] text-[#F18721]">O que muda na sua casa</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#2B3094] sm:text-5xl">
                Trabalhe, estude, jogue e maratone — tudo junto, sem travar.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Fibra rápida e estável pra rotina inteira: vários aparelhos ligados, videochamada rolando e streaming na
                resolução máxima — sem depender da sorte.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {benefitPoints.map((item) => (
                <div
                  key={item.title}
                  className="lp-card-interactive rounded-[2rem] border border-[#2B3094]/10 bg-[#f5f6fb] p-5"
                >
                  <span className="lp-icon-pop mb-5 grid size-12 place-items-center rounded-2xl border border-[#F18721]/30 bg-[#F18721]/12 text-[#F18721] shadow-[0_0_26px_rgba(241,135,33,0.18)]">
                    <BenefitIcon title={item.title} />
                  </span>
                  <h3 className="text-lg font-black tracking-[-0.03em] text-[#2B3094]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2B3094] px-5 py-20 text-white sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.26em] text-white/90">Por que avançar agora</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                Sua casa merece uma internet à altura da sua rotina.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                A consulta é sem compromisso: primeiro, nossa equipe verifica a disponibilidade na sua rua e, depois,
                ajuda você a escolher o plano ideal para a sua casa, seja 1000 MB ou 1300 MB.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {stats.map(([title, text]) => (
                  <div key={title} className="lp-card-interactive rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
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

        <section className="bg-white px-5 py-20 text-[#2B3094] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#F18721]">Antes de escolher</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#2B3094] sm:text-5xl">
              Dúvidas comuns antes de contratar
            </h2>
            <div className="mt-10 divide-y divide-[#2B3094]/10 overflow-hidden rounded-[2rem] border border-[#2B3094]/10 bg-[#f5f6fb]">
              {purchaseFaqs.map(([question, answer]) => (
                <details key={question} className="group p-5 transition hover:bg-[#2B3094]/5 open:bg-[#2B3094]/8 sm:p-6">
                  <summary className="cursor-pointer list-none text-lg font-black tracking-[-0.03em] text-[#2B3094]">
                    {question}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="proximos-passos" className="scroll-mt-28 bg-[#2B3094] px-5 pb-20 text-white sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-[#F18721]/30 bg-[radial-gradient(circle_at_20%_20%,rgba(241,135,33,0.26),transparent_30%),linear-gradient(135deg,#232878,#2B3094)] p-8 text-center sm:p-12">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#F18721]">Próximo passo</p>
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
    <main className="lp-animated lp-custom-cursor min-h-screen overflow-hidden bg-white text-[#2B3094]">
      <CustomCursor />
      <FloatingHeader
        menuItems={landingMenuItems}
        ctaLabel="Consultar rua"
        onCtaClick={openConsultationModal}
        visible={isFloatingHeaderVisible}
      />
      <section className="relative isolate bg-[#2B3094] px-5 pb-0 pt-28 text-white sm:px-8 lg:px-12">
        <div className="lp-gradient-shift absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(241,135,33,0.22),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(255,255,255,0.10),transparent_32%),linear-gradient(135deg,#2B3094_0%,#232878_52%,#2B3094_100%)]" />
        <div className="absolute left-1/2 top-28 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-white/10 bg-white/5 blur-3xl" />

        <div id="topo" className="scroll-mt-28 mx-auto flex max-w-5xl flex-col items-center pt-6 text-center sm:pt-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
            <span className="lp-pulse-dot size-2 rounded-full bg-[#F18721] shadow-[0_0_18px_#F18721]" />
            Internet Fibra Ótica em São Luís e Região
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            Internet fibra perto de você.
            <span className="lp-hero-wordmark block bg-gradient-to-r from-white via-white to-[#F18721] bg-clip-text text-transparent">
              Consulte se chega na sua rua.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            O Starzinho cruza bairro, rua e rota de cobertura para iniciar a consulta da ST1 Internet antes do atendimento seguir
            pelo WhatsApp.
          </p>
        </div>

        <div className="mx-auto mt-9 flex max-w-5xl items-start gap-3 text-left sm:gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-[#F18721] bg-[#232878] shadow-[0_0_34px_rgba(241,135,33,0.32)] sm:size-24">
            <Image
              src="/perfil-starzinho.png"
              alt="Starzinho"
              width={301}
              height={301}
              priority
              className="lp-float h-full w-full object-cover"
            />
          </div>
          <div className="lp-card-interactive relative flex-1 rounded-2xl rounded-tl-sm border border-white/20 bg-white/82 px-5 py-4 text-[#232878] shadow-[0_18px_45px_rgba(0,0,0,0.25)] backdrop-blur before:absolute before:left-[-8px] before:top-7 before:size-4 before:rotate-45 before:border-b before:border-l before:border-white/20 before:bg-white/82 sm:px-6 sm:py-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2B3094]">Starzinho</p>
            <p className="mt-1 text-base font-semibold leading-7 sm:text-lg">
              Eu já vi sinais de rota na região. Agora preciso do seu bairro e da sua rua para consultar se a fibra da
              ST1 Internet pode chegar no seu endereço e quais opções fazem sentido para sua casa.
            </p>
          </div>
        </div>

        <div id="consulta" ref={consultationFormRef} className="scroll-mt-28 mx-auto mt-8 max-w-5xl">
          <div className="lp-motion-card overflow-hidden rounded-[2rem] border border-white/15 bg-[#232878]/95 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="rounded-t-[2rem] border-b border-white/10 bg-white/10 p-4 sm:p-5">
              {renderBairroPicker("bairro-picker-main")}
            </div>

            {selectedBairro ? renderConsultationForm() : null}
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-white" aria-hidden="true" />
      </section>

      <section className="relative bg-white px-5 py-20 text-[#2B3094] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#F18721]">O que muda na sua casa</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#2B3094] sm:text-5xl">
              Trabalhe, estude, jogue e maratone — tudo junto, sem travar.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Fibra rápida e estável pra rotina inteira: vários aparelhos ligados, videochamada rolando e streaming na
              resolução máxima — sem depender da sorte.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {benefitPoints.map((item) => (
              <div
                key={item.title}
                className="lp-card-interactive rounded-[2rem] border border-[#2B3094]/10 bg-[#f5f6fb] p-5"
              >
                <span className="lp-icon-pop mb-5 grid size-12 place-items-center rounded-2xl border border-[#F18721]/30 bg-[#F18721]/12 text-[#F18721] shadow-[0_0_26px_rgba(241,135,33,0.18)]">
                  <BenefitIcon title={item.title} />
                </span>
                <h3 className="text-lg font-black tracking-[-0.03em] text-[#2B3094]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="streaming" className="scroll-mt-28 bg-[#2B3094] px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-white/15 bg-[radial-gradient(circle_at_top_right,rgba(241,135,33,0.18),transparent_28%),linear-gradient(135deg,#232878_0%,#2B3094_100%)]">
          <div className="grid gap-12 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-14">
            <div className="max-w-xl">
              <p className="inline-flex items-center rounded-full border border-[#F18721]/30 bg-[#F18721]/8 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#F18721]">
                Ultra velocidade
              </p>
              <h2 className="mt-7 text-4xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl">
                Assista tudo.
                <span className="mt-2 block text-[#F18721]">Sem travar.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                De séries e filmes ao BBB ao vivo e aos jogos da Copa do Mundo, a fibra da ST1 Internet aguenta maratona,
                vários aparelhos conectados e imagem em alta definição sem depender da sorte.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {streamingHighlights.map((item) => (
                  <span
                    key={item}
                    className="lp-card-interactive inline-flex rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto min-h-[470px] w-full max-w-[760px]">
              <div className="lp-image-tilt absolute right-[8%] top-0 z-20 w-[44%] rotate-[4deg] overflow-hidden rounded-[1.75rem] border border-white/12 shadow-[0_30px_70px_rgba(0,0,0,0.32)]">
                <div className="relative aspect-[0.95]">
                  <Image
                    src="/serie-1.png"
                    alt="Poster de série"
                    fill
                    sizes="(max-width: 1024px) 48vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lp-image-tilt absolute left-[10%] top-10 z-10 w-[52%] -rotate-[4deg] overflow-hidden rounded-[1.75rem] border border-[#F18721]/18 shadow-[0_30px_70px_rgba(0,0,0,0.34)]">
                <div className="relative aspect-[0.82]">
                  <Image
                    src="/bbb.png"
                    alt="Programa ao vivo"
                    fill
                    sizes="(max-width: 1024px) 54vw, 24vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lp-image-tilt absolute bottom-20 right-[16%] z-40 w-[40%] rotate-[7deg] overflow-hidden rounded-[1.5rem] border border-white/12 shadow-[0_30px_70px_rgba(0,0,0,0.34)]">
                <div className="relative aspect-[0.9]">
                  <Image
                    src="/copa-do-mundo.jpg"
                    alt="Estádio lotado em jogo da Copa do Mundo"
                    fill
                    sizes="(max-width: 1024px) 42vw, 18vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-50 overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#232878]/90 px-5 py-7 shadow-[0_22px_60px_rgba(0,0,0,0.26)]">
                <div className="lp-marquee flex min-w-max items-center gap-8 text-[1.7rem] font-black tracking-[-0.04em] text-white/92 sm:text-[2.2rem]">
                  {[...streamingPlatforms, ...streamingPlatforms].map((platform, index) => (
                    <span
                      key={`${platform}-${index}`}
                      className={
                        index % 3 === 0
                          ? "text-[#ff2d2d]"
                          : index % 3 === 1
                            ? "text-[#29b8ff]"
                            : "text-[#ffffff]"
                      }
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="st1" className="scroll-mt-28 bg-white px-5 py-20 text-[#2B3094] sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-[560px] rounded-[2rem] border border-[#e7ebf2] bg-white p-4 shadow-[0_30px_80px_rgba(17,20,63,0.12)]">
            <div className="absolute inset-4 rounded-[1.5rem] border border-[#F18721]/10" />
            <div className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] bg-[#dfe7ef]">
              <Image
                src="/card_home_01_1.jpg"
                alt="Profissional da ST1 Internet em ambiente de atendimento"
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-[0_18px_45px_rgba(17,20,63,0.16)] backdrop-blur">
                <div className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F18721] text-lg font-black text-white">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#2B3094]">Compromisso ST1 Internet</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Qualidade em cada conexão.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#e2e6ee] bg-[#eef2f8] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#2B3094]">
              <span className="size-2 rounded-full bg-[#F18721]" />
              Quem somos
            </p>
            <h2 className="mt-7 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#2B3094] sm:text-5xl">
              A melhor internet do Maranhão começa com quem{" "}
              <span className="text-[#F18721]">entende de conexão</span>
            </h2>
            <div className="mt-7 grid gap-5 text-base font-semibold leading-7 text-slate-600">
              <p>
                A <strong className="text-[#2B3094]">ST1 Internet</strong> nasceu com um propósito claro: entregar
                internet de verdade para quem não aceita lentidão, quedas constantes ou promessas vazias.
              </p>
              <p>
                Investimos em infraestrutura própria, fibra óptica até a sua casa e monitoramento contínuo para
                garantir <strong className="text-[#2B3094]">velocidade real, estabilidade e desempenho superior</strong>,
                todos os dias.
              </p>
              <p>
                Atendemos São Luís e diversas cidades do Maranhão com um padrão de qualidade que coloca a ST1 Internet entre os
                provedores mais confiáveis da região.
              </p>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {[
                ["▤", "Infraestrutura Própria"],
                ["⌖", "Atendimento Local"],
                ["⚡", "Tecnologia de Ponta"],
                ["↗", "Expansão Constante"],
              ].map(([icon, title]) => (
                <div key={title} className="lp-card-interactive flex items-center gap-4 rounded-2xl border border-[#e7ebf2] bg-white px-4 py-4 shadow-[0_14px_35px_rgba(17,20,63,0.06)]">
                  <span className="lp-icon-pop grid size-10 shrink-0 place-items-center rounded-xl bg-[#fff0e8] text-lg font-black text-[#F18721]">
                    {icon}
                  </span>
                  <p className="text-sm font-black text-[#2B3094]">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="duvidas" className="scroll-mt-28 bg-[#2B3094] px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-white/90">Por que avançar agora</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Sua casa merece uma internet à altura da sua rotina.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              A consulta é sem compromisso: primeiro, nossa equipe verifica a disponibilidade na sua rua e, depois,
              ajuda você a escolher o plano ideal para a sua casa, seja 1000 MB ou 1300 MB.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {stats.map(([title, text]) => (
                <div key={title} className="lp-card-interactive rounded-[2rem] border border-white/10 bg-white/[0.055] p-5">
                  <h3 className="text-lg font-black tracking-[-0.03em] text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid min-h-[340px] place-items-center lg:min-h-[500px]">
            <Image
              src="/starzinho-no-rocket.png"
              alt="Starzinho voando em um foguete com notebook"
              width={1254}
              height={1254}
              className="lp-float h-auto w-full max-w-[500px] object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-[#2B3094] sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#F18721]">Dúvidas</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#2B3094] sm:text-5xl">
            Antes de consultar sua rua
          </h2>
          <div className="mt-10 divide-y divide-[#2B3094]/10 overflow-hidden rounded-[2rem] border border-[#2B3094]/10 bg-[#f5f6fb]">
            {purchaseFaqs.map(([question, answer]) => (
              <details key={question} className="group p-5 transition hover:bg-[#2B3094]/5 open:bg-[#2B3094]/8 sm:p-6">
                <summary className="cursor-pointer list-none text-lg font-black tracking-[-0.03em] text-[#2B3094]">
                  {question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#2B3094] px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="lp-motion-card mx-auto max-w-7xl rounded-[2.75rem] border border-white/15 bg-[radial-gradient(circle_at_top_left,rgba(241,135,33,0.16),transparent_30%),linear-gradient(135deg,#232878,#2B3094)] p-6 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#F18721]">Consulta de cobertura</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Como funciona a consulta com o Starzinho
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Em poucos passos, você descobre se a ST1 Internet já pode chegar até sua rua.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(([title, text], index) => (
              <div
                key={title}
                className="lp-card-interactive lp-step-card rounded-[2rem] border border-white/15 bg-white/10 p-5"
                style={{ animationDelay: `${index * 70 + 140}ms` }}
              >
                <span className="lp-icon-pop grid size-11 place-items-center rounded-2xl bg-white text-sm font-black text-[#2B3094]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-black tracking-[-0.04em] text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-20 text-[#2B3094] sm:px-8 lg:px-12">
        <div className="lp-motion-card mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-[#2B3094]/10 bg-[#f5f6fb] p-8 text-center shadow-[0_24px_70px_rgba(43,48,148,0.08)] sm:p-12">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-[-0.05em] text-[#2B3094] sm:text-5xl">
            Quer saber se essa rota chega até sua rua?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Informe seu bairro e sua rua para consultar a disponibilidade da ST1 Internet pelo WhatsApp.
          </p>
          <button
            type="button"
            onClick={openConsultationModal}
            className="lp-magnetic-cta mt-8 inline-flex rounded-full bg-[#F18721] px-8 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-[#f59a45]"
          >
            Verificar minha rua
          </button>
        </div>
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B3094]/80 px-4 py-6 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#2B3094]/98 shadow-[0_24px_90px_rgba(43,48,148,0.45)]">
            <div className="flex items-center justify-between rounded-t-[2rem] border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white/80">Consulta de cobertura</p>
                <p className="mt-1 text-lg font-black text-white">Preencha seus dados para verificar a disponibilidade</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white/80 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Fechar
              </button>
            </div>

            <div className="border-b border-white/10 bg-white/10 p-4 sm:p-5">
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
