import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Languages, LogOut, Monitor, RefreshCw } from "lucide-react";

import { neonSupabaseCompat as supabase } from "@/lib/neon-auth-compat";
import { usePortal } from "@/lib/portal-store";
import { getAdminUrl } from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LANGS } from "@/lib/portal-routes";
import type { Lang } from "@/lib/portal-types";

export const Route = createFileRoute("/veld/meer")({
  head: () => ({
    meta: [
      { title: "Meer — Maximilien veld-app" },
      { name: "description", content: "Profiel, taal en afmelden in de veld-app van de stadsboerderij." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Meer — Maximilien veld-app" },
      { property: "og:description", content: "Profiel, taal en afmelden in de veld-app van de stadsboerderij." },
    ],
  }),
  component: FieldMore,
});

function FieldMore() {
  const { currentUser, lang, setLang } = usePortal();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="space-y-4">
      <h1 className="pt-1 text-2xl font-bold">Meer</h1>

      <section className="rounded-xl border border-border bg-card p-4">
        <p className="text-base font-semibold">{currentUser.name}</p>
        <p className="text-sm text-muted-foreground">{currentUser.email}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          {currentUser.role === "admin" ? "Beheerder" : "Team"}
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Languages className="h-4 w-4" aria-hidden /> Taal
        </div>
        <div className="mt-3 flex gap-2">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l as Lang)}
              className={cn(
                "flex-1 rounded-lg border py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
                lang === l
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-surface",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      <a
        href={getAdminUrl("/portaal")}
        className="flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-card text-base font-semibold"
      >
        <Monitor className="h-5 w-5" aria-hidden /> Volledig beheer openen
      </a>

      <Button
        type="button"
        variant="secondary"
        className="h-14 w-full text-base"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="mr-2 h-5 w-5" aria-hidden /> Gegevens vernieuwen
      </Button>

      <Button type="button" variant="destructive" className="h-14 w-full text-base" onClick={signOut}>
        <LogOut className="mr-2 h-5 w-5" aria-hidden /> Afmelden
      </Button>
    </div>
  );
}
