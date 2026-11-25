import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [
    { title: "Admin settings — KaziPesa" },
    { name: "description", content: "Manage administrative settings for KaziPesa." },
    { property: "og:title", content: "Admin settings — KaziPesa" },
    { property: "og:description", content: "Manage administrative settings for KaziPesa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Admin settings" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
