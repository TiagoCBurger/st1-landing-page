import Image from "next/image";

const painPoints = [
  {
    title: "Reuniao travando",
    text: "Mais estabilidade para trabalhar em casa sem interrupcoes.",
  },
  {
    title: "Video carregando toda hora",
    text: "Assista seus conteudos com mais fluidez, sem depender de uma conexao instavel.",
  },
  {
    title: "Jogo com lag",
    text: "Conexao mais estavel para jogar online com menos dor de cabeca.",
  },
  {
    title: "Wi-Fi fraco nos comodos",
    text: "Mais performance para casas com varios aparelhos conectados ao mesmo tempo.",
  },
  {
    title: "Internet caindo no pior momento",
    text: "Sua rotina precisa de uma conexao confiavel quando voce mais precisa.",
  },
];

const plans = [
  {
    name: "1000MB",
    price: "R$ 89,90/mes",
    label: "Rota principal",
    description:
      "Uma opcao para quem quer internet fibra rapida, estavel e com otimo custo-beneficio para navegar, trabalhar, estudar, assistir e jogar.",
    features: ["Fibra optica", "Conexao estavel", "Wi-Fi 6", "Suporte tecnico", "Otimo custo-beneficio"],
  },
  {
    name: "1300MB",
    price: "R$ 109,90/mes",
    label: "Mais performance",
    description:
      "Uma opcao para quem quer mais velocidade e mais performance para uma rotina com mais pessoas, mais dispositivos conectados e maior consumo de internet.",
    features: ["Mais velocidade", "Mais performance", "Fibra optica", "Wi-Fi 6", "Suporte tecnico"],
  },
];

const steps = [
  ["Informe seu bairro", "Escolha uma das regioes com viabilidade no formulario."],
  ["Digite sua rua", "Com sua rua, conseguimos consultar melhor a disponibilidade."],
  ["O Starzinho te guia", "Depois da consulta, o atendimento segue pelo WhatsApp."],
  ["A ST1 confirma", "O time verifica se a instalacao pode avancar no seu endereco."],
  ["Orientacao do plano ideal", "O atendimento te ajuda a seguir com a melhor opcao."],
  ["Instalacao", "Se houver disponibilidade, voce recebe os proximos passos para ativacao."],
];

const stats = [
  ["Milhares de clientes conectados", "Estrutura preparada para atender rotinas residenciais cada vez mais digitais."],
  ["Rede em expansao", "Novas rotas de cobertura podem ser liberadas conforme a viabilidade tecnica."],
  ["Atendimento proximo", "O atendimento segue pelo WhatsApp com contexto sobre sua localizacao."],
  ["Fibra para o dia a dia", "Internet para trabalhar, estudar, assistir, jogar e manter a casa conectada."],
];

const faqs = [
  [
    "A ST1 atende qualquer rua do bairro?",
    "Nao necessariamente. A disponibilidade pode variar por rua e endereco. Por isso, pedimos bairro e rua para consultar a viabilidade antes do proximo passo.",
  ],
  [
    "Por que preciso informar minha rua?",
    "Porque a cobertura depende da rota de fibra disponivel na regiao. Com sua rua, o time consegue verificar se a instalacao pode avancar no seu endereco.",
  ],
  [
    "Preciso escolher o plano agora?",
    "Nao. Primeiro, voce consulta se a ST1 chega ate sua rua. Depois, o atendimento te ajuda a entender se o plano de 1000MB ou 1300MB combina melhor com sua rotina.",
  ],
  [
    "Quais planos residenciais estao disponiveis?",
    "A LP apresenta duas opcoes residenciais: 1000MB por R$ 89,90/mes e 1300MB por R$ 109,90/mes. A disponibilidade deve ser confirmada conforme a regiao.",
  ],
  [
    "A ST1 usa fibra optica?",
    "Sim. A comunicacao da ST1 reforca internet fibra com foco em velocidade, estabilidade e desempenho para a rotina residencial.",
  ],
  ["O atendimento continua por onde?", "Depois do envio dos dados, o atendimento segue pelo WhatsApp."],
  ["O formulario tem custo ou compromisso?", "Nao. O formulario serve para iniciar a consulta de disponibilidade."],
];

export default function V1LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050914] text-white">
      <section className="relative isolate px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(0,148,255,0.34),transparent_32%),radial-gradient(circle_at_83%_18%,rgba(255,116,0,0.28),transparent_30%),linear-gradient(135deg,#050914_0%,#07182c_50%,#080b12_100%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-3xl" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="#topo" className="flex items-center gap-3" aria-label="ST1 Internet">
            <Image
              src="/logo-ST1-03%201.png"
              alt="ST1 Internet"
              width={453}
              height={327}
              className="h-auto w-[52px] sm:w-[64px]"
            />
            <span className="hidden text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100 sm:inline">
              Internet Fibra
            </span>
          </a>
          <a
            href="#consulta"
            className="rounded-full border border-[#ff7400]/45 bg-[#ff7400] px-5 py-2.5 text-sm font-extrabold text-[#120804] shadow-[0_0_32px_rgba(255,116,0,0.35)] transition hover:-translate-y-0.5 hover:bg-[#ff8a1f]"
          >
            Verificar minha rua
          </a>
        </div>

        <div id="topo" className="mx-auto grid max-w-7xl items-center gap-10 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
              <span className="size-2 rounded-full bg-[#ff7400] shadow-[0_0_18px_#ff7400]" />
              Rota de internet fibra com o Starzinho
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              Descubra se a fibra da ST1
              <span className="block bg-gradient-to-r from-cyan-200 via-white to-[#ff7400] bg-clip-text text-transparent">
                chega na sua rua.
              </span>
            </h1>
            <div className="mt-6 flex max-w-2xl items-start gap-3 text-left sm:items-center">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#ff7400] bg-[#07111f] shadow-[0_0_28px_rgba(255,116,0,0.28)]">
                <Image
                  src="/starzinho.png"
                  alt="Starzinho"
                  width={6000}
                  height={7000}
                  priority
                  className="h-full w-full scale-[2.2] object-cover object-[50%_31%]"
                />
              </div>
              <div className="relative flex-1 rounded-2xl border border-white/15 bg-white px-5 py-4 text-[#07111f] shadow-[0_18px_45px_rgba(0,0,0,0.25)] before:absolute before:left-[-8px] before:top-6 before:size-4 before:rotate-45 before:border-b before:border-l before:border-white/15 before:bg-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#072f78]">Starzinho</p>
                <p className="mt-1 text-base font-semibold leading-7 sm:text-lg">
                  Informe seu bairro e sua rua para consultar a disponibilidade da ST1 e ver as ofertas disponiveis para
                  o seu endereco.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => (
                <div key={plan.name} className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff7400]">{plan.label}</p>
                  <p className="mt-3 text-4xl font-black tracking-[-0.04em] text-white">{plan.name}</p>
                  <p className="mt-1 text-xl font-extrabold text-cyan-200">{plan.price}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" id="consulta">
            <div className="absolute -inset-7 rounded-[3rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-[#ff7400]/20 blur-2xl" />
            <div className="relative rounded-[2.5rem] border border-white/12 bg-[#07111f]/85 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6">
              <div className="relative mb-5 min-h-[250px] overflow-hidden rounded-[2rem] border border-cyan-200/10 bg-[radial-gradient(circle_at_50%_35%,rgba(0,148,255,0.28),transparent_42%),linear-gradient(160deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]">
                <div className="absolute inset-x-8 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
                <div className="absolute left-[18%] top-[28%] size-3 rounded-full bg-cyan-200 shadow-[0_0_28px_#67e8f9]" />
                <div className="absolute right-[18%] top-[62%] size-3 rounded-full bg-[#ff7400] shadow-[0_0_28px_#ff7400]" />
                <Image
                  src="/startzinho2.png"
                  alt="Starzinho, mascote da ST1, guiando a consulta de cobertura"
                  width={257}
                  height={300}
                  priority
                  className="absolute bottom-0 left-1/2 w-52 -translate-x-1/2 drop-shadow-[0_24px_44px_rgba(0,148,255,0.35)] sm:w-60"
                />
              </div>

              <form className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5" action="/mapa" method="get">
                <div>
                  <p className="text-2xl font-black tracking-[-0.04em] text-white">Consulte se a ST1 chega na sua rua</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Preencha os dados abaixo para o Starzinho iniciar a verificacao de cobertura.
                  </p>
                </div>
                <label className="block">
                  <span className="text-sm font-bold text-cyan-100">Nome completo</span>
                  <input
                    name="nome"
                    required
                    placeholder="Digite seu nome completo"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#09182b] px-4 py-3 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-cyan-100">WhatsApp</span>
                  <input
                    name="whatsapp"
                    required
                    inputMode="tel"
                    placeholder="(00) 00000-0000"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#09182b] px-4 py-3 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-cyan-100">Bairro</span>
                    <select
                      name="bairro"
                      required
                      defaultValue="Cohatrac"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#09182b] px-4 py-3 text-white outline-none ring-cyan-300/30 transition focus:border-cyan-300 focus:ring-4"
                    >
                      <option>Cohatrac</option>
                      <option>Novo bairro em breve</option>
                      <option>Novo bairro em breve</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-cyan-100">Rua</span>
                    <input
                      name="rua"
                      required
                      placeholder="Digite sua rua"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#09182b] px-4 py-3 text-white outline-none ring-cyan-300/30 transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-4"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#ff7400] px-5 py-4 text-base font-black text-[#130905] shadow-[0_0_34px_rgba(255,116,0,0.36)] transition hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(255,116,0,0.5)]"
                >
                  Verificar minha rua
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff7400]">Chega de conexao instavel</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              Chega de internet travando no meio da sua rotina!
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Trabalhar, estudar, jogar ou assistir nao deveria depender de uma conexao instavel.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {painPoints.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:border-cyan-200/30">
                <span className="mb-5 block size-3 rounded-full bg-[#ff7400] shadow-[0_0_22px_#ff7400]" />
                <h3 className="text-lg font-black tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
          <a href="#consulta" className="mt-8 inline-flex rounded-full bg-cyan-300 px-6 py-3 font-black text-[#04101f] shadow-[0_0_32px_rgba(103,232,249,0.26)] transition hover:-translate-y-0.5">
            Verificar se a ST1 chega na minha rua
          </a>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">Planos residenciais</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
                O Starzinho te ajuda a entender qual plano combina com sua casa
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Informe seu bairro e sua rua. Depois da consulta, o atendimento te orienta entre 1000MB e 1300MB.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {plans.map((plan) => (
                <article key={plan.name} className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#081629] p-6 shadow-2xl">
                  <div className="absolute -right-14 -top-14 size-40 rounded-full bg-cyan-300/10 blur-2xl" />
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#ff7400]">{plan.label}</p>
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
                  <a href="#consulta" className="mt-7 inline-flex w-full justify-center rounded-2xl border border-cyan-200/30 px-5 py-3 font-black text-cyan-100 transition hover:bg-cyan-200 hover:text-[#04101f]">
                    Consultar disponibilidade
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(0,148,255,0.12),rgba(255,116,0,0.10))] p-6 sm:p-10">
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
          <a href="#consulta" className="mt-8 inline-flex rounded-full bg-[#ff7400] px-6 py-3 font-black text-[#130905] transition hover:-translate-y-0.5">
            Comecar consulta agora
          </a>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-cyan-200">ST1 no Maranhao</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              A ST1 ja conecta milhares de pessoas no Maranhao
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Uma rede em expansao, feita para entregar mais velocidade e estabilidade para a rotina dos clientes.
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
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#ff7400]">Perguntas frequentes</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">Antes de consultar sua rota</h2>
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
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] border border-[#ff7400]/25 bg-[radial-gradient(circle_at_20%_20%,rgba(255,116,0,0.26),transparent_30%),linear-gradient(135deg,#07182c,#050914)] p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
            Quer saber se essa rota chega ate sua rua?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Informe seu bairro e sua rua para consultar a disponibilidade da ST1 pelo WhatsApp.
          </p>
          <a href="#consulta" className="mt-8 inline-flex rounded-full bg-[#ff7400] px-8 py-4 font-black text-[#07111f] transition hover:-translate-y-0.5">
            Verificar minha rua
          </a>
        </div>
      </section>
    </main>
  );
}
