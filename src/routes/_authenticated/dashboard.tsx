import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard — KaziPesa" },
    { name: "description", content: "Review your KaziPesa task activity, earnings and account updates." },
    { property: "og:title", content: "Dashboard — KaziPesa" },
    { property: "og:description", content: "Your KaziPesa task activity, earnings and account updates." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Dashboard" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
