import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({ meta: [
    { title: "Wallet — KaziPesa" },
    { name: "description", content: "View your KaziPesa balance and manage withdrawal requests." },
    { property: "og:title", content: "Wallet — KaziPesa" },
    { property: "og:description", content: "View your KaziPesa balance and manage withdrawal requests." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Wallet" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
