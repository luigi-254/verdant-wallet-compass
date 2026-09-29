import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AuthCard, FieldError } from "@/components/app/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { isValidKenyanPhone, normalizePhone } from "@/lib/format";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>) => ({ ref: typeof s.ref === "string" ? s.ref : undefined }),
  head: () => ({
    meta: [
      { title: "Create account — KaziPesa" },
      { name: "description", content: "Create a free KaziPesa account to start completing online tasks." },
      { property: "og:title", content: "Create account — KaziPesa" },
      { property: "og:description", content: "Join KaziPesa and start completing tasks." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { ref } = Route.useSearch();
  const navigate = useNavigate();
  const [f, setF] = useState({ full_name: "", email: "", phone: "", password: "", confirm: "", referral: ref ?? "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (f.full_name.trim().length < 3) err.full_name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = "Enter a valid email";
    if (!isValidKenyanPhone(f.phone)) err.phone = "Enter a valid Kenyan number e.g. 0712345678";
    if (f.password.length < 8) err.password = "At least 8 characters";
    if (f.password !== f.confirm) err.confirm = "Passwords do not match";
    if (!agree) err.agree = "You must accept the terms";
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: f.email.trim(),
      password: f.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: f.full_name.trim(), phone: normalizePhone(f.phone), referral_code: f.referral.trim() },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    if (data.session) {
      toast.success("Account created");
      await navigate({ to: "/dashboard" });
    } else {
      toast.success("Check your email to confirm your account");
      await navigate({ to: "/login", search: { redirect: undefined, suspended: undefined } });
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="It's free. Complete tasks and track your earnings."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary">Log in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div><Label htmlFor="n">Full name</Label><Input id="n" value={f.full_name} onChange={set("full_name")} className="mt-1.5" /><FieldError msg={errors.full_name} /></div>
        <div><Label htmlFor="e">Email</Label><Input id="e" type="email" value={f.email} onChange={set("email")} className="mt-1.5" /><FieldError msg={errors.email} /></div>
        <div><Label htmlFor="p">Phone number</Label><Input id="p" inputMode="tel" placeholder="0712 345 678" value={f.phone} onChange={set("phone")} className="mt-1.5" /><FieldError msg={errors.phone} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" value={f.password} onChange={set("password")} className="mt-1.5" /><FieldError msg={errors.password} /></div>
          <div><Label htmlFor="cpw">Confirm password</Label><Input id="cpw" type="password" value={f.confirm} onChange={set("confirm")} className="mt-1.5" /><FieldError msg={errors.confirm} /></div>
        </div>
        <div><Label htmlFor="r">Referral code (optional)</Label><Input id="r" value={f.referral} onChange={set("referral")} className="mt-1.5 uppercase" /></div>
        <div>
          <label className="flex items-start gap-2 text-sm">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
            <span>I agree to the <Link to="/terms" className="font-semibold text-primary">Terms</Link> and <Link to="/privacy" className="font-semibold text-primary">Privacy Policy</Link></span>
          </label>
          <FieldError msg={errors.agree} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account…" : "Create Account"}</Button>
      </form>
    </AuthCard>
  );
}
