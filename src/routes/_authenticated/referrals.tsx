import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/referrals")({
  head: () => ({ meta: [
    { title: "Refer & Earn — KaziPesa" },
    { name: "description", content: "Manage your KaziPesa referrals and track eligible rewards." },
    { property: "og:title", content: "Refer & Earn — KaziPesa" },
    { property: "og:description", content: "Manage your KaziPesa referrals and track eligible rewards." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Refer & Earn" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
