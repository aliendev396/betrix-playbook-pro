import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { LeagueBadge, TeamCrest } from "@/components/common/TeamCrest";
import { useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";
import { formatKickoff, leagueById, teamById, type Match } from "@/data/football";

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const { toggleSelection, isSelected } = useBetrix();
  const home = teamById(match.homeId);
  const away = teamById(match.awayId);
  const league = leagueById(match.leagueId);
  const market = match.markets.find((m) => m.id === "1x2")!;
  const disabled = market.status !== "ACTIVE" || match.status !== "SCHEDULED";

  return (
    <article className="surface-card rounded-2xl p-3.5 transition-colors hover:border-primary/40 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <LeagueBadge name={league.name} color={league.color} />
        <span className="tabular text-xs font-medium text-muted-foreground">{formatKickoff(match.kickoff)}</span>
      </div>

      <Link
        to="/match/$matchId"
        params={{ matchId: match.id }}
        className="mt-3 block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <TeamCrest team={home} size={compact ? "sm" : "md"} />
            <span className="truncate text-sm font-semibold">{compact ? home.short : home.name}</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">vs</span>
          <div className="flex min-w-0 items-center justify-end gap-2">
            <span className="truncate text-right text-sm font-semibold">{compact ? away.short : away.name}</span>
            <TeamCrest team={away} size={compact ? "sm" : "md"} />
          </div>
        </div>
      </Link>

      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {market.options.map((opt) => {
          const active = isSelected(match.id, market.id, opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() =>
                toggleSelection({
                  matchId: match.id,
                  marketId: market.id,
                  marketName: market.name,
                  optionId: opt.id,
                  optionLabel: opt.label,
                  multiplier: opt.multiplier,
                })
              }
              className={cn(
                "group flex flex-col items-center rounded-xl border border-border bg-surface-2/60 px-2 py-2 transition-all duration-150 active:scale-[0.97]",
                "disabled:cursor-not-allowed disabled:opacity-40",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-primary/50 hover:bg-surface-2",
              )}
            >
              <span className={cn("text-[10px] font-medium uppercase tracking-wider", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {opt.label}
              </span>
              <span className="tabular text-sm font-bold">
                {disabled ? <Lock className="h-3.5 w-3.5" /> : opt.multiplier.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
