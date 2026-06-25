import type { Metadata } from "next";
import Script from "next/script";
import "leaflet/dist/leaflet.css";

import SiteFooter from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "ST1 Internet Fibra | Consulte cobertura com o Starzinho",
  description:
    "Consulte se a rota de internet fibra da ST1 chega na sua rua e conheca planos residenciais de 1000MB e 1300MB.",
};

const GTM_ID = "GTM-KZD7GHCT";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Script id="google-tag-manager-data-layer" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          `}
        </Script>
        <Script
          id="google-tag-manager"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
          strategy="afterInteractive"
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
