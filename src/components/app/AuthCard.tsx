import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-soft/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-extrabold text-secondary">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div> : null}
      </div>
    </div>
  );
}

export function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs text-destructive">{msg}</p> : null;
}
