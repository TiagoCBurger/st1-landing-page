import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";

import SiteFooter from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ST1 Internet Fibra | Consulte cobertura com o Starzinho",
  description:
    "Consulte se a rota de internet fibra da ST1 chega na sua rua e conheca planos residenciais de 1000MB e 1300MB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
