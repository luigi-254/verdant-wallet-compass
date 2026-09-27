import { Link } from "@tanstack/react-router";

import { LogoMark } from "@/components/brand/Logo";

const LINKS = [
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/faq", label: "FAQ" },
  { to: "/terms", label: "Terms" },
  { to: "/privacy", label: "Privacy" },
  { to: "/responsible-use", label: "Responsible Use" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-extrabold tracking-tight">KaziPesa</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-secondary-foreground/70">
            An online platform for completing tasks and managing digital earnings.
          </p>
          <p className="mt-4 max-w-sm text-xs text-secondary-foreground/60">
            Earnings depend on the tasks available and on successfully completing them. KaziPesa
            does not guarantee any level of income.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Platform</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-secondary-foreground/70 hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-secondary-foreground/60">
          © 2026 KaziPesa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
