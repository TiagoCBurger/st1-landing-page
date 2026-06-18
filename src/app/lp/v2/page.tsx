import type { Metadata } from "next";

import V2LandingPage from "@/components/lp/v2-landing-page";

export const metadata: Metadata = {
  title: "ST1 Internet Fibra | Consulte cobertura com o Starzinho",
  description:
    "Consulte se a rota de internet fibra da ST1 chega na sua rua e conheça planos residenciais de 1000MB e 1300MB.",
};

export default function LpV2Page() {
  return <V2LandingPage />;
}
