import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, Share2, Ticket, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/States";
import { formatPoints, useBetrix, type HistoryEntry } from "@/store/betrix";
import { formatDate, leagueById, matchById, teamById } from "@/data/football";

export function SlipContent({ onDone }: { onDone?: () => void }) {
  const { slip, removeSelection, clearSlip, totalMultiplier, confirmSlip, points } = useBetrix();
  const [stake, setStake] = useState(250);
  const [confirmed, setConfirmed] = useState<HistoryEntry | null>(null);

  if (confirmed) {
    return (
      <div className="space-y-4 p-4">
        <div className="surface-card rounded-2xl p-5 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Prediction Code</p>
          <p className="mt-2 font-mono text-3xl font-extrabold text-primary">{confirmed.code}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {confirmed.selections.length} selections · {formatPoints(confirmed.stake)} PTS staked
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard?.writeText(confirmed.code);
                toast.success("Code copied");
              }}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Code
            </Button>
            <Button
              onClick={() => {
                const text = `Load my BETRIX prediction code ${confirmed.code}`;
                if (navigator.share) navigator.share({ text }).catch(() => undefined);
                else {
                  navigator.clipboard?.writeText(text);
                  toast.success("Share text copied");
                }
              }}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Code
            </Button>
          </div>
        </div>
        <Button variant="secondary" className="w-full" onClick={() => { setConfirmed(null); onDone?.(); }}>
          Done
        </Button>
      </div>
    );
  }

  if (slip.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={<Ticket className="h-5 w-5" />}
          title="Your slip is empty"
          description="Pick outcomes from any match to build a prediction. All entries use virtual points — never real money."
          action={
            <Button asChild variant="outline" onClick={() => onDone?.()}>
              <Link to="/matches">Browse matches</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const potential = Math.round(stake * totalMultiplier);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold">
          {slip.length} selection{slip.length > 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={clearSlip}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear all
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
        {slip.map((s) => {
          const match = matchById(s.matchId);
          if (!match) return null;
          const home = teamById(match.homeId);
          const away = teamById(match.awayId);
          const league = leagueById(match.leagueId);
          return (
            <div key={`${s.matchId}-${s.marketId}`} className="rise-in rounded-xl border border-border bg-surface-2/50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {home.short} vs {away.short}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {league.name} · {formatDate(match.kickoff)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remove selection"
                  onClick={() => removeSelection(s.matchId, s.marketId)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-background/40 px-2.5 py-1.5">
                <span className="truncate text-xs text-muted-foreground">{s.marketName}</span>
                <span className="text-xs font-bold text-primary">{s.optionLabel}</span>
                <span className="tabular text-xs font-bold">{s.multiplier.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t border-border bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Combined multiplier</span>
          <span className="tabular font-bold text-primary">{totalMultiplier.toFixed(2)}x</span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="stake" className="text-sm text-muted-foreground">
            Points
          </label>
          <Input
            id="stake"
            type="number"
            min={50}
            step={50}
            value={stake}
            onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
            className="tabular h-10 flex-1 text-right font-semibold"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2.5">
          <span className="text-sm font-medium">Potential virtual points</span>
          <span className="tabular text-lg font-extrabold text-primary">{formatPoints(potential)}</span>
        </div>
        <Button
          className="h-12 w-full text-sm font-bold tracking-wide"
          disabled={stake <= 0 || stake > points}
          onClick={() => setConfirmed(confirmSlip(stake))}
        >
          CONFIRM PREDICTION
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          BETRIX uses virtual points for entertainment only. No real money, deposits, withdrawals or cash payouts.
        </p>
      </div>
    </div>
  );
}
