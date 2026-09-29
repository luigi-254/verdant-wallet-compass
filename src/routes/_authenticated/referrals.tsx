import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/referrals")({
  head: () => ({ meta: [{ title: "Refer & Earn — KaziPesa" }, { name: "description", content: "Refer & Earn on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Refer & Earn" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
