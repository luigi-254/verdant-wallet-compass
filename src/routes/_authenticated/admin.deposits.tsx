import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/deposits")({
  head: () => ({ meta: [
    { title: "Admin deposits — KaziPesa" },
    { name: "description", content: "Review and manage KaziPesa deposit requests." },
    { property: "og:title", content: "Admin deposits — KaziPesa" },
    { property: "og:description", content: "Review and manage KaziPesa deposit requests." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Admin deposits" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
