import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  Bell,
  ClipboardCheck,
  Gift,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  Users,
  Wallet,
  Banknote,
  PiggyBank,
  X,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const USER_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/referrals", label: "Refer & Earn", icon: Gift },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const ADMIN_NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/tasks", label: "Tasks", icon: ListChecks },
  { to: "/admin/submissions", label: "Submissions", icon: ClipboardCheck },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: Banknote },
  { to: "/admin/deposits", label: "Deposits", icon: PiggyBank },
  { to: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function NotificationBell() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["notifications", "recent", user?.id],
    enabled: !!user,
    refetchInterval: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });
  const unread = data.filter((n) => !n.read).length;

  async function markAll() {
    await supabase.from("notifications").update({ read: true }).eq("user_id", user!.id).eq("read", false);
    void qc.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted"
        >
          <Bell className="size-5" />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-bold">Notifications</p>
          {unread > 0 ? (
            <button onClick={markAll} className="text-xs font-semibold text-primary">Mark all read</button>
          ) : null}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {data.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            data.map((n) => (
              <div key={n.id} className={cn("border-b border-border/60 px-4 py-3 last:border-0", !n.read && "bg-primary-soft/40")}>
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatDateTime(n.created_at)}</p>
              </div>
            ))
          )}
        </div>
        <Link to="/notifications" className="block border-t border-border px-4 py-2.5 text-center text-sm font-semibold text-primary">
          View all
        </Link>
      </PopoverContent>
    </Popover>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const inAdmin = pathname.startsWith("/admin");
  const nav = inAdmin ? ADMIN_NAV : USER_NAV;

  const sidebar = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: item.to === "/admin" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          activeProps={{ className: "bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary" }}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
      <div className="my-3 h-px bg-border" />
      {isAdmin ? (
        <Link
          to={inAdmin ? "/dashboard" : "/admin"}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary hover:bg-muted"
        >
          <Shield className="size-4" />
          {inAdmin ? "User area" : "Admin panel"}
        </Link>
      ) : null}
      <button
        onClick={() => void signOut()}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <LogOut className="size-4" />
        Log out
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card p-4 lg:flex">
        <div className="mb-6 px-2"><Logo /></div>
        {inAdmin ? <p className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-primary">Admin</p> : null}
        {sidebar}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-card p-4">
            <div className="mb-6 flex items-center justify-between px-2">
              <Logo />
              <button aria-label="Close menu" onClick={() => setOpen(false)}><X className="size-5" /></button>
            </div>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <p className="hidden text-sm text-muted-foreground sm:block">
              Hello, <span className="font-semibold text-foreground">{profile?.full_name?.split(" ")[0] || "there"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/profile">My profile</Link>
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
