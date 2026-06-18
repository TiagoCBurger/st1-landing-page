import type { Metadata } from "next";

import V1LandingPage from "@/components/lp/v1-landing-page";

export const metadata: Metadata = {
  title: "ST1 Internet Fibra | LP v1",
  description: "Versão anterior da landing page ST1 com consulta de cobertura pelo Starzinho.",
};

export default function LpV1Page() {
  return <V1LandingPage />;
}
