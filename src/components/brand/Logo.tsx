import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M5 19V5" strokeLinecap="round" />
        <path d="M18 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.5 10.5h8M3.5 14h8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "text-lg font-extrabold tracking-tight",
          inverted ? "text-primary-foreground" : "text-secondary",
        )}
      >
        Kazi<span className="text-primary">Pesa</span>
      </span>
    </Link>
  );
}
