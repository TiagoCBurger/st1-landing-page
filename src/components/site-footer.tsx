import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/st1internet",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.5]">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/st1-internet/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M6.5 8.5h3v10h-3v-10zm1.5-4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zm4 4.5h2.9v1.4h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6v5.55h-3v-4.92c0-1.17-.02-2.68-1.63-2.68-1.63 0-1.88 1.28-1.88 2.6v4.99h-3v-10z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@st1.internet",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.1 5 12 5 12 5s-6.1 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.4 26.4 0 0 0 2 12a26.4 26.4 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.9 19 12 19 12 19s6.1 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.4 26.4 0 0 0 22 12a26.4 26.4 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#2B3094]/10 bg-[#2B3094] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:px-12 lg:py-14">
        <div>
          <Link href="/lp/v2" className="inline-flex items-center" aria-label="ST1 Internet">
            <Image
              src="/logo-ST1-03.png"
              alt="ST1 Internet"
              width={453}
              height={327}
              className="h-auto w-[72px] sm:w-[84px]"
            />
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            A melhor internet do Maranhão. Velocidade, estabilidade e suporte que você pode confiar.
            Conecte-se ao futuro hoje mesmo.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-slate-200 transition hover:border-[#F18721]/60 hover:text-[#F18721]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#F18721]">Contato</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a
                href="tel:+559830140992"
                className="inline-flex items-center gap-3 text-slate-300 transition hover:text-white"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-[#F18721]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.75]">
                    <path d="M6.5 4.8c0-.8.6-1.5 1.4-1.6l2.2-.3c.7-.1 1.3.3 1.5.9l1 2.8c.2.5 0 1.1-.5 1.4l-1.6 1c1.1 2.1 2.8 3.8 4.9 4.9l1-1.6c.3-.5.9-.7 1.4-.5l2.8 1c.6.2 1 .8.9 1.5l-.3 2.2c-.1.8-.8 1.4-1.6 1.4C10.2 18.8 5.2 13.8 5.2 7.3 5.2 6.5 5.8 5.8 6.5 4.8z" />
                  </svg>
                </span>
                (98) 3014-0992
              </a>
            </li>
            <li>
              <a
                href="mailto:contato@st1.net.br"
                className="inline-flex items-center gap-3 text-slate-300 transition hover:text-white"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-[#F18721]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.75]">
                    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                contato@st1.net.br
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8 px-5 py-5 text-center text-xs text-slate-500 sm:px-8 lg:px-12">
        © 2026 ST1 Internet. Todos os direitos reservados. Feito por V4 Company Kloh &amp; CO.
      </div>
    </footer>
  );
}
