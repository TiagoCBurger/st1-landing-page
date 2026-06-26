export const painPoints = [
  {
    title: "Reunião travando",
    text: "Mais estabilidade para trabalhar em casa sem interrupções.",
  },
  {
    title: "Vídeo carregando toda hora",
    text: "Assista seus conteúdos com mais fluidez, sem depender de uma conexão instável.",
  },
  {
    title: "Jogo com lag",
    text: "Conexão mais estável para jogar online com menos dor de cabeça.",
  },
  {
    title: "Wi-Fi fraco nos cômodos",
    text: "Mais performance para casas com vários aparelhos conectados ao mesmo tempo.",
  },
  {
    title: "Internet caindo no pior momento",
    text: "Sua rotina precisa de uma conexão confiável quando você mais precisa.",
  },
];

export const plans = [
  {
    name: "1000MB",
    price: "R$ 89,90/mês",
    label: "Rota principal",
    description:
      "Uma opção para quem quer internet fibra rápida, estável e com ótimo custo-benefício para navegar, trabalhar, estudar, assistir e jogar.",
    features: ["Fibra óptica", "Conexão estável", "Wi-Fi 6", "Suporte técnico", "Ótimo custo-benefício"],
  },
  {
    name: "1300MB",
    price: "R$ 109,90/mês",
    label: "Mais performance",
    description:
      "Uma opção para quem quer mais velocidade e mais performance para uma rotina com mais pessoas, mais dispositivos conectados e maior consumo de internet.",
    features: ["Mais velocidade", "Mais performance", "Fibra óptica", "Wi-Fi 6", "Suporte técnico"],
  },
];

export const steps = [
  ["Informe seu bairro", "Escolha uma das regiões com viabilidade no formulário."],
  ["Digite sua rua", "Com sua rua, conseguimos consultar melhor a disponibilidade."],
  ["O Starzinho te guia", "Depois da consulta, o atendimento segue pelo WhatsApp."],
  ["A ST1 confirma", "O time verifica se a instalação pode avançar no seu endereço."],
  ["Orientação do plano ideal", "O atendimento te ajuda a seguir com a melhor opção."],
  ["Instalação", "Se houver disponibilidade, você recebe os próximos passos para ativação."],
];

export const stats = [
  ["Milhares de clientes conectados", "Estrutura preparada para atender rotinas residenciais cada vez mais digitais."],
  ["Rede em expansão", "Novas rotas de cobertura podem ser liberadas conforme a viabilidade técnica."],
  ["Atendimento próximo", "O atendimento segue pelo WhatsApp com contexto sobre sua localização."],
  ["Fibra para o dia a dia", "Internet para trabalhar, estudar, assistir, jogar e manter a casa conectada."],
];

export const faqs = [
  [
    "A ST1 atende qualquer rua do bairro?",
    "Não necessariamente. A disponibilidade pode variar por rua e endereço. Por isso, pedimos bairro e rua para consultar a viabilidade antes do próximo passo.",
  ],
  [
    "Por que preciso informar minha rua?",
    "Porque a cobertura depende da rota de fibra disponível na região. Com sua rua, o time consegue verificar se a instalação pode avançar no seu endereço.",
  ],
  [
    "Preciso escolher o plano agora?",
    "Não. Primeiro, você consulta se a ST1 chega até sua rua. Depois, o atendimento te ajuda a entender se o plano de 1000MB ou 1300MB combina melhor com sua rotina.",
  ],
  [
    "Quais planos residenciais estão disponíveis?",
    "A LP apresenta duas opções residenciais: 1000MB por R$ 89,90/mês e 1300MB por R$ 109,90/mês. A disponibilidade deve ser confirmada conforme a região.",
  ],
  [
    "A ST1 usa fibra óptica?",
    "Sim. A comunicação da ST1 reforça internet fibra com foco em velocidade, estabilidade e desempenho para a rotina residencial.",
  ],
  ["O atendimento continua por onde?", "Depois do envio dos dados, o atendimento segue pelo WhatsApp."],
  ["O formulário tem custo ou compromisso?", "Não. O formulário serve para iniciar a consulta de disponibilidade."],
];

export type CoverageBairro = {
  id: string;
  name: string;
  city: string;
  networkStatus: string;
  status: string;
  text: string;
  note?: string;
  available: boolean;
};

const coverageBairrosSource = `Anjo da Guarda	São Luís	A SER PROJETADO	
Fumace	São Luís	A SER PROJETADO	
Vila Embratel	São Luís	A SER PROJETADO	
Vila Conceição (Coroadinho)	São Luís	A SER PROJETADO	
Vila Nova	São Luís	A SER PROJETADO	
Paraíso	São Luís	A SER PROJETADO	
Parque Das Palmeiras	São Luís	A SER PROJETADO	
Parque Amazonas	São Luís	A SER PROJETADO	
Vila Mauro Fecury I	São Luís	A SER PROJETADO	
Santo Antônio - PAP	São Luís	CONSTRUIDA	
Bom Jesus	São Luís	A SER PROJETADO	
Vila Isabel	São Luís	A SER PROJETADO	
Vila Lobão - PAP	São Luís	CONSTRUIDA	
Maioba do Janipapeiro	São Luís	CONSTRUIDA	
Tirirical - PANFLETAGEM	São Luís	CONSTRUIDA	
Forquilha	São Luís	CONSTRUIDA	
Vila Palmeira	São Luís	CONSTRUIDA	
Jardim São Cristóvão	São Luís	CONSTRUIDA	
Parque São Cristóvão	São Luís	CONSTRUIDA	
São Raimundo	São Luís	A SER PROJETADO	
Santa Efigênia	São Luís	CONSTRUIDA	
Vila Itamar	São Luís	A SER PROJETADO	
São Cristóvão	São Luís	CONSTRUIDA	
Vila Esperança	São Luís	A SER PROJETADO	
Maracanã	São Luís	A SER PROJETADO	
Tibiri	São Luís	A SER PROJETADO	
Cohama	São Luís	CONSTRUIDA	
Bequimão	São Luís	CONSTRUIDA	
Maranhão Novo	São Luís	CONSTRUIDA	
Recanto dos Vinhais	São Luís	CONSTRUIDA	
Planalto Vinhais I	São Luís	CONSTRUIDA	
Planalto Vinhais II	São Luís	CONSTRUIDA	
Anil	São Luís	CONSTRUIDA	
Ipase de Baixo	São Luís	CONSTRUIDA	
Pirapora	São Luís	CONSTRUIDA	
Res. João Alberto	São Luís	CONSTRUIDA	
Cohab Anil I	São Luís	CONSTRUIDA	
Cohab Anil II	São Luís	CONSTRUIDA	
Cambôa	São Luís	A SER PROJETADO	
Turu	São Luís	CONSTRUIDA	
Olho d’Água	São Luís	CONSTRUIDA	
Vila Luizão	São Luís	CONSTRUIDA	
Jardim Eldorado	São Luís	CONSTRUIDA	
Vila Vicente Fialho	São Luís	CONSTRUIDA	
Parque Vitória	São José de Ribamar	CONSTRUIDA	
Vila Operária	São José de Ribamar	CONSTRUIDA	
Santa Efigênia	São Luís	CONSTRUIDA	
Residencial José Reinaldo Tavares	São Luís	A SER PROJETADO	
Maiobão	Paço do Lumiar	CONSTRUIDA	
Cohatrac I	São Luís	CONSTRUIDA	
Cohatrac II	São Luís	CONSTRUIDA	
Cohatrac III	São Luís	CONSTRUIDA	
Cohatrac IV	São Luís	CONSTRUIDA	
Cohatrac V	São José de Ribamar	CONSTRUIDA	
Jardim América	São Luís	CONSTRUIDA	
Maiobinha	São José de Ribamar	CONSTRUIDA	
Cidade Olímpica	São Luís	CONSTRUIDA	Área construida parcialmente, algumas partes do Bairro ainda não temos rede
Vila Janaína	São Luís	A SER PROJETADO	
Vila Riod	São Luís	A SER PROJETADO	
Cruzeiro De Santa Barbara	São Luís	A SER PROJETADO	
Vila Cascavel	São Luís	A SER PROJETADO	
Res. Aroeiras	São Luís	CONSTRUIDA	
Jardim São Cristóvão II	São Luís	CONSTRUIDA	
Vila Brasil	São Luís	CONSTRUIDA	
Parque dos Sabiás	São Luís	CONSTRUIDA	
Vila Flamengo	São José de Ribamar	CONSTRUIDA	
Jardim Tropical	São José de Ribamar	A SER PROJETADO	
J. Lima	São José de Ribamar	CONSTRUIDA	
Vila São José	São José de Ribamar	CONSTRUIDA	
Vila São Luís	São José de Ribamar	CONSTRUIDA	
Vila Cafeteira	São José de Ribamar	CONSTRUIDA	
Vila Kiola	São José de Ribamar	CONSTRUIDA	
Geniparana	São Luís	CONSTRUIDA	
Jardim Conceição	São Luís	CONSTRUIDA	
Alemanha	São Luís	CONSTRUIDA	
Radional	São Luís	CONSTRUIDA	
Santa Cruz	São Luís	CONSTRUIDA	
Vera Cruz	São Luís	CONSTRUIDA	
Pão de Açúcar	São Luís	CONSTRUIDA	
Angelim	São Luís	CONSTRUIDA	
Calhau	São Luís	CONSTRUIDA	
Renascença	São Luís	CONSTRUIDA	
Jardim Renascença	São Luís	CONSTRUIDA	
Cohafuma	São Luís	CONSTRUIDA	
Parque Universitario	São Luís	CONSTRUIDA	
Residencial Santos Dumont	São Luís	CONSTRUIDA	
Residencial João do Vale	São Luís	CONSTRUIDA	
Vila Isabel Cafeteira	São Luís	CONSTRUIDA	
João de Deus	São Luís	CONSTRUIDA	
Cruzeiro do Anil	São Luís	CONSTRUIDA	
Aurora	São Luís	CONSTRUIDA	
Cohab Anil III	São Luís	CONSTRUIDA	
Cohab Anil III	São Luís	CONSTRUIDA	
Res. Canaã Anil	São Luís	CONSTRUIDA	
Bairro de Fátima	São Luís	CONSTRUIDA	Entrega da rede prevista para 20/06/26
Liberdade	São Luís	EM CONSTRUÇÃO	Entrega da rede prevista para 20/06/26
Monte Castelo	São Luís	CONSTRUIDA	Entrega da rede prevista para 20/06/26
Areinha	São Luís	CONSTRUIDA	Entrega da rede prevista para 20/06/26
Fé em Deus	São Luís	EM CONSTRUÇÃO	Entrega da rede prevista para 20/06/26
Parque Amazonas	São Luís	EM CONSTRUÇÃO	Entrega da rede prevista para 20/06/26
Camboa	São Luís	EM CONSTRUÇÃO	Entrega da rede prevista para 20/06/26
Bom Milage	São Luís	EM CONSTRUÇÃO	Entrega da rede prevista para 20/06/26
Retiro Natal	São Luís	EM CONSTRUÇÃO	Entrega da rede prevista para 20/06/26
Pirâmide	Raposa / Paço do Lumiar	CONSTRUIDA	
Alto do Farol	Raposa	CONSTRUIDA	
Res. Thalita	Raposa	CONSTRUIDA	
Itapera	Paço do Lumiar	CONSTRUIDA	
Cotovelo	Paço do Lumiar	CONSTRUIDA	
Itapeua	Raposa	CONSTRUIDA	
Cumbique	Raposa	CONSTRUIDA	
Vila Boa Esperança	Raposa	CONSTRUIDA	
Alto Da Base	Raposa	CONSTRUIDA	
Jardim das Oliveiras	Raposa	CONSTRUIDA	
Vila Maresia	Raposa	CONSTRUIDA	
Inhaúma	Raposa	CONSTRUIDA	
Vila Rio São João	Paço do Lumiar	CONSTRUIDA	
Parque Araçagy	Paço do Lumiar	CONSTRUIDA	
Divinéia	São Luís	CONSTRUIDA	
Vila Alonso Costa	São José de Ribamar	CONSTRUIDA	
Conj. Habitacional Turu	São Luís	CONSTRUIDA	
Planalto Turu 1	São Luís	CONSTRUIDA	
Ipem Turu	São Luís	CONSTRUIDA	
Loteamento Terra Livre	São José de Ribamar	CONSTRUIDA	
Residencial Canudos	São José de Ribamar	CONSTRUIDA	
Parque Vitória	São José de Ribamar	CONSTRUIDA	
Alto do Turu I	São José de Ribamar	CONSTRUIDA	
Alto do Turu II	São José de Ribamar	CONSTRUIDA	
Parque Jair	São José de Ribamar	CONSTRUIDA	
Vila Maioba do Janipapeiro	Paço do Lumiar	CONSTRUIDA	
Novo Cohatrac	São José de Ribamar	CONSTRUIDA	
Jardim das Margaridas	São Luís	CONSTRUIDA	
Jardim Aracagy	São José de Ribamar	CONSTRUIDA	
Jardim Alvorada	São José de Ribamar	CONSTRUIDA	
Itaguara II	São José de Ribamar	CONSTRUIDA	
Sítio Trizidela	São José de Ribamar	CONSTRUIDA	
Trizidela	São José de Ribamar	CONSTRUIDA	
Res. Nova Aurora	São José de Ribamar	CONSTRUIDA	
Planalto Anil I	São Luís	CONSTRUIDA	
Planalto Anil II	São Luís	CONSTRUIDA	
Planalto Anil III	São Luís	CONSTRUIDA	
Novo Angelim	São Luís	CONSTRUIDA	
Parque Athenas	São Luís	CONSTRUIDA	
Alto do Calhau	São Luís	CONSTRUIDA	
Residencial Buriti	São José de Ribamar	CONSTRUIDA	
Residencial São José	São José de Ribamar	CONSTRUIDA	
Paraiso das rosas	Paço do Lumiar	CONSTRUIDA	
Lima Verde	Paço do Lumiar	CONSTRUIDA	
Res. Renascer	Paço do Lumiar	CONSTRUIDA	
Residencial La Belle Park	Paço do Lumiar	CONSTRUIDA	
Vila Nazaré	Paço do Lumiar	CONSTRUIDA	
Conj. Tambau	Paço do Lumiar	CONSTRUIDA	
Res. Jaguarema	Paço do Lumiar	CONSTRUIDA	
Parque Jaguarema	Paço do Lumiar	CONSTRUIDA	
Conj. Hab. Paranã	Paço do Lumiar	CONSTRUIDA	
Lot. Manaira	Paço do Lumiar	CONSTRUIDA	
Conj. Upaon - Açu	Paço do Lumiar	CONSTRUIDA	
Pindaí	Paço do Lumiar	CONSTRUIDA	
Vila Epitácio Cafeteira	Paço do Lumiar	CONSTRUIDA	
Lot. Jardim Paraná	Paço do Lumiar	CONSTRUIDA	
Sítio natureza	Paço do Lumiar	CONSTRUIDA	
Novo Paço	Paço do Lumiar	CONSTRUIDA	
Alto do Laranjal	Paço do Lumiar	CONSTRUIDA	
Cidade Verde	Paço do Lumiar	CONSTRUIDA	
Novo Horizonte	Paço do Lumiar	CONSTRUIDA	
Jardim das Mercês	Paço do Lumiar	CONSTRUIDA	
Conj. Roseana Sarney	Paço do Lumiar	CONSTRUIDA	
Residencial Nova Jerusalém	Paço do Lumiar	CONSTRUIDA	
Vila Sarney Filho I	Paço do Lumiar	CONSTRUIDA	
Vila Tijupa Queimado	Paço do Lumiar	CONSTRUIDA	
Vila Sarney Filho II	Paço do Lumiar	CONSTRUIDA	
Vila São José	Paço do Lumiar	CONSTRUIDA	
São Francisco	São Luís	CONSTRUIDA	
Jardim São Francisco	São Luís	CONSTRUIDA	
Ilhinha	São Luís	CONSTRUIDA	
Pau Deitado	São José de Ribamar	CONSTRUIDA	
Mutirão	São José de Ribamar	CONSTRUIDA	
J. Camara	São José de Ribamar	CONSTRUIDA	
Moropoia	São José de Ribamar	CONSTRUIDA	
São Raimundo	São José de Ribamar	CONSTRUIDA	
Cruzeiro	São José de Ribamar	CONSTRUIDA	
Vila Alcione	São José de Ribamar	CONSTRUIDA	
São Benedito	São José de Ribamar	CONSTRUIDA	
Vila Roseana	São José de Ribamar	CONSTRUIDA	
Vila Dr. Julinho	Paço do Lumiar	CONSTRUIDA	
Campina	São José de Ribamar	CONSTRUIDA	
Panaquatira	São José de Ribamar	CONSTRUIDA`;

function slugifyBairro(value: string) {
  return value
    .replace(/[’']/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const coverageBairros: CoverageBairro[] = (() => {
  const usedIds = new Map<string, number>();

  return coverageBairrosSource.split("\n").map((line) => {
    const [name, city, networkStatus, note] = line.split("\t").map((value) => value.trim());
    const available = networkStatus.toUpperCase() === "CONSTRUIDA";
    const baseId = slugifyBairro(name);
    const currentCount = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, currentCount + 1);

    return {
      id: currentCount === 0 ? baseId : `${baseId}-${slugifyBairro(city)}-${currentCount + 1}`,
      name,
      city,
      networkStatus,
      status: available ? "Rede construída" : "Em construção",
      text: available
        ? "Disponível para consulta de viabilidade na sua rua."
        : "Estamos construindo a rota. Em breve disponível no seu bairro.",
      note: note || undefined,
      available,
    };
  });
})();
