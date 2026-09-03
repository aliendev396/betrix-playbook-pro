import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Coins } from "lucide-react";
import { SectionHeading } from "@/components/common/States";
import { formatPoints, useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/points")({
  head: () => ({
    meta: [
      { title: "Virtual Points — BETRIX" },
      { name: "description", content: "See your BETRIX virtual points balance, staking activity and rewards. Virtual points have no cash value." },
      { property: "og:title", content: "Virtual Points — BETRIX" },
      { property: "og:description", content: "Balance, activity and rewards for BETRIX virtual points." },
    ],
  }),
  component: PointsPage,
});

function PointsPage() {
  const { points, history } = useBetrix();
  const staked = history.reduce((a, h) => a + h.stake, 0);
  const won = history.reduce((a, h) => a + h.payout, 0);
  const pending = history.filter((h) => h.status === "PENDING").length;

  const ledger = history.flatMap((h) => [
    { id: `${h.code}-s`, label: `Stake · ${h.code}`, at: h.createdAt, delta: -h.stake },
    ...(h.payout > 0 ? [{ id: `${h.code}-p`, label: `Payout · ${h.code}`, at: h.createdAt, delta: h.payout }] : []),
  ]);

  return (
    <div className="space-y-4">
      <section className="surface-card brand-gradient rounded-3xl p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Virtual points balance</p>
        <p className="tabular mt-2 flex items-center gap-2 text-4xl font-extrabold">
          <Coins className="h-7 w-7 text-primary" />
          {formatPoints(points)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Entertainment only. Points carry no monetary value and cannot be withdrawn.</p>
      </section>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total staked", value: formatPoints(staked) },
          { label: "Total won", value: formatPoints(won) },
          { label: "Pending slips", value: String(pending) },
        ].map((s) => (
          <div key={s.label} className="surface-card rounded-2xl p-4">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="tabular mt-1 text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <SectionHeading title="Activity" subtitle="Recent points movements" />
      <div className="surface-card rounded-2xl p-2">
        {ledger.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-3 border-b border-border/50 px-3 py-3 last:border-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{l.label}</p>
              <p className="tabular text-xs text-muted-foreground">
                {new Date(l.at).toLocaleDateString("en-GB", { dateStyle: "medium" })}
              </p>
            </div>
            <span className={cn("tabular flex shrink-0 items-center gap-1 text-sm font-bold", l.delta > 0 ? "text-success" : "text-muted-foreground")}>
              {l.delta > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {formatPoints(Math.abs(l.delta))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
