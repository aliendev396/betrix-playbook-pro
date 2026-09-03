import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionHeading } from "@/components/common/States";
import { formatPoints, useBetrix, selectionMatch } from "@/store/betrix";
import { teamById } from "@/data/football";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Prediction History — BETRIX" },
      { name: "description", content: "Track every BETRIX prediction slip you have submitted, with results, virtual points staked and codes." },
      { property: "og:title", content: "Prediction History — BETRIX" },
      { property: "og:description", content: "Settled and pending prediction slips with full selection breakdowns." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history } = useBetrix();

  return (
    <div className="space-y-4">
      <SectionHeading title="Prediction history" subtitle={`${history.length} slips submitted`} />

      {history.length === 0 ? (
        <EmptyState title="No predictions yet" description="Your submitted slips will appear here." />
      ) : (
        <div className="space-y-3">
          {history.map((h) => (
            <article key={h.code} className="surface-card rounded-2xl p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="tabular truncate text-sm font-bold">{h.code}</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 shrink-0"
                      aria-label={`Copy code ${h.code}`}
                      onClick={() => {
                        void navigator.clipboard.writeText(h.code);
                        toast.success("Prediction code copied");
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="tabular mt-0.5 text-xs text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 text-[10px] uppercase tracking-wider",
                    h.status === "WON" && "bg-success/20 text-success",
                    h.status === "LOST" && "bg-destructive/20 text-destructive",
                    h.status === "PENDING" && "bg-muted text-muted-foreground",
                  )}
                >
                  {h.status}
                </Badge>
              </div>

              <ul className="mt-3 space-y-1.5">
                {h.selections.map((s, i) => {
                  const m = selectionMatch(s);
                  return (
                    <li key={i} className="flex items-center justify-between gap-3 border-b border-border/50 pb-1.5 text-xs last:border-0">
                      <span className="min-w-0 truncate">
                        {m ? `${teamById(m.homeId).short} vs ${teamById(m.awayId).short}` : "Match"} · {s.marketName}: <span className="font-semibold">{s.optionLabel}</span>
                      </span>
                      <span className="tabular shrink-0 font-semibold">{s.multiplier.toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Staked <span className="tabular font-semibold text-foreground">{formatPoints(h.stake)}</span> pts
                </span>
                <span className={cn("tabular font-bold", h.payout > 0 ? "text-success" : "text-muted-foreground")}>
                  {h.payout > 0 ? `+${formatPoints(h.payout)} pts` : h.status === "PENDING" ? "Awaiting results" : "No return"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
