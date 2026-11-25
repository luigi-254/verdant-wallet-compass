import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href, suspended: undefined },
      });
    }
    const { data: profile } = await supabase.from("profiles").select("status").eq("id", data.user.id).maybeSingle();
    if (profile?.status === "suspended") {
      await supabase.auth.signOut();
      throw redirect({
        to: "/login",
        search: { redirect: undefined, suspended: "1" },
      });
    }
    return { user: data.user };
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
