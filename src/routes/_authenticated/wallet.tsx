import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({ meta: [{ title: "Wallet — KaziPesa" }, { name: "description", content: "Wallet on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Wallet" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
