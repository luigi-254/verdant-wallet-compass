import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AuthCard } from "@/components/app/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
    suspended: typeof s["suspended"] === "string" ? s["suspended"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Log in — KaziPesa" },
      { name: "description", content: "Log in to your KaziPesa account to complete tasks and manage your wallet." },
      { property: "og:title", content: "Log in — KaziPesa" },
      { property: "og:description", content: "Access your KaziPesa dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Enter your email and password"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { toast.error(error.message === "Invalid login credentials" ? "Incorrect email or password" : error.message); return; }
    const dest = search.redirect && search.redirect.startsWith("/") && !search.redirect.startsWith("//") ? search.redirect : "/dashboard";
    await navigate({ to: dest });
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue to your dashboard."
      footer={<>New to KaziPesa? <Link to="/register" search={{ ref: undefined }} className="font-semibold text-primary">Create an account</Link></>}
    >
      {search.suspended ? (
        <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          This account has been suspended. Please contact support.
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} /> Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-primary">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in…" : "Log in"}</Button>
      </form>
    </AuthCard>
  );
}
