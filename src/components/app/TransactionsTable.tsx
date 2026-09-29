import type { Tables } from "@/integrations/supabase/types";
import { formatDateTime, formatKES, shortRef, typeLabel } from "@/lib/format";
import { StatusBadge } from "./bits";

export function TransactionsTable({ rows, showDescription }: { rows: Tables<"transactions">[]; showDescription?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="py-2 pr-3 font-semibold">Reference</th>
            <th className="py-2 pr-3 font-semibold">Date</th>
            <th className="py-2 pr-3 font-semibold">Type</th>
            {showDescription ? <th className="py-2 pr-3 font-semibold">Description</th> : null}
            <th className="py-2 pr-3 text-right font-semibold">Amount</th>
            <th className="py-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-b border-border/60 last:border-0">
              <td className="py-3 pr-3 font-mono text-xs text-muted-foreground" title={t.reference}>{shortRef(t.reference)}</td>
              <td className="py-3 pr-3 whitespace-nowrap">{formatDateTime(t.created_at)}</td>
              <td className="py-3 pr-3">{typeLabel(t.type)}</td>
              {showDescription ? <td className="py-3 pr-3 text-muted-foreground">{t.description}</td> : null}
              <td className={`py-3 pr-3 text-right font-semibold ${t.type === "withdrawal" ? "text-destructive" : "text-success"}`}>
                {t.type === "withdrawal" ? "−" : "+"}
                {formatKES(t.amount)}
              </td>
              <td className="py-3"><StatusBadge status={t.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
