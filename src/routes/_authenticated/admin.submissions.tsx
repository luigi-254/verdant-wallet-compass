import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/submissions")({
  head: () => ({ meta: [
    { title: "Admin submissions — KaziPesa" },
    { name: "description", content: "Review submitted work and decisions in KaziPesa administration." },
    { property: "og:title", content: "Admin submissions — KaziPesa" },
    { property: "og:description", content: "Review submitted work and decisions in KaziPesa administration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Admin submissions" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
