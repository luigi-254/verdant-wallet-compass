import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AuthCard } from "@/components/app/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — KaziPesa" },
      { name: "description", content: "Choose a new password for your KaziPesa account." },
      { property: "og:title", content: "Set new password — KaziPesa" },
      { property: "og:description", content: "Choose a new password." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (pw !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    await navigate({ to: "/dashboard" });
  }

  return (
    <AuthCard title="Set a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <div><Label htmlFor="p">New password</Label><Input id="p" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" /></div>
        <div><Label htmlFor="c">Confirm password</Label><Input id="c" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5" /></div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving…" : "Update password"}</Button>
      </form>
    </AuthCard>
  );
}
