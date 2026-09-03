import { createFileRoute } from "@tanstack/react-router";
import { Copy, Share2, Users2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/States";
import { partners, growthSeries } from "@/data/admin";
import { formatPoints, useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partner & Referral Program — BETRIX" },
      { name: "description", content: "Grow the BETRIX community with your referral code and earn virtual reward points — never cash commissions." },
      { property: "og:title", content: "Partner & Referral Program — BETRIX" },
      { property: "og:description", content: "Referral analytics and virtual reward tiers for BETRIX partners." },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { profile } = useBetrix();
  const myCode = `BTX-${profile.username.slice(0, 5).toUpperCase()}`;
  const maxSignups = Math.max(...partners.map((p) => p.signups));

  return (
    <div className="space-y-4">
      <section className="surface-card brand-gradient rounded-3xl p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your referral code</p>
        <p className="tabular mt-2 text-3xl font-extrabold">{myCode}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            className="gap-2"
            onClick={() => {
              void navigator.clipboard.writeText(myCode);
              toast.success("Referral code copied");
            }}
          >
            <Copy className="h-4 w-4" /> Copy code
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              void navigator.clipboard.writeText(`Join me on BETRIX — free football predictions. Use code ${myCode}`);
              toast.success("Invite message copied");
            }}
          >
            <Share2 className="h-4 w-4" /> Share invite
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Rewards are paid in virtual points for entertainment only. BETRIX pays no monetary commissions.
        </p>
      </section>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Your signups", value: "24" },
          { label: "Active referrals", value: "11" },
          { label: "Reward points", value: formatPoints(3400) },
        ].map((s) => (
          <div key={s.label} className="surface-card rounded-2xl p-4">
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
            <p className="tabular mt-1 text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <SectionHeading title="Top partners" subtitle="Ranked by community signups this season" />
      <div className="space-y-2">
        {partners.map((p, i) => (
          <div key={p.id} className="surface-card rounded-2xl p-4">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-muted text-sm font-bold text-primary">{i + 1}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="tabular truncate text-xs text-muted-foreground">{p.code} · {p.slipsDriven} slips driven</p>
              </div>
              <span className={cn("shrink-0 text-xs font-semibold", p.tier === "Gold" ? "text-primary" : "text-muted-foreground")}>{p.tier}</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(p.signups / maxSignups) * 100}%` }} aria-hidden />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users2 className="h-3.5 w-3.5" /> {p.signups} signups
              </span>
              <span className="tabular font-semibold text-foreground">{formatPoints(p.rewardPoints)} pts</span>
            </div>
          </div>
        ))}
      </div>

      <SectionHeading title="Community growth" subtitle="Referred signups over the last 7 days" />
      <div className="surface-card rounded-2xl p-4">
        <div className="flex h-32 items-end gap-2">
          {growthSeries.map((g) => (
            <div key={g.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t bg-primary" style={{ height: `${(g.users / 402) * 100}%` }} aria-hidden />
              <span className="text-[10px] text-muted-foreground">{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
