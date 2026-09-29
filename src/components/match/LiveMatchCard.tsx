import { Link } from "@tanstack/react-router";
import { LeagueBadge, TeamCrest } from "@/components/common/TeamCrest";
import { leagueById, teamById, type Match } from "@/data/football";
import { cn } from "@/lib/utils";

export function LiveBadge({ minute }: { minute?: number | undefined }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#00A859]">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#00A859]" />
      Live{minute != null ? ` ${minute}'` : ""}
    </span>
  );
}

export function LiveMatchCard({ match, className }: { match: Match; className?: string }) {
  const home = teamById(match.homeId);
  const away = teamById(match.awayId);
  const league = leagueById(match.leagueId);

  return (
    <Link
      to="/match/$matchId"
      params={{ matchId: match.id }}
      className={cn(
        "bg-white border border-gray-200 block rounded-2xl p-4 transition-all duration-200 hover:border-red-200 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <LeagueBadge name={league.name} color={league.color} />
        <LiveBadge minute={match.minute} />
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamCrest team={home} size="md" />
          <span className="truncate text-xs font-semibold text-gray-700">{home.short}</span>
        </div>
        <div className="text-2xl font-extrabold tracking-tight text-gray-900 tabular">
          {match.homeScore} <span className="text-gray-300">—</span> {match.awayScore}
        </div>
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          <TeamCrest team={away} size="md" />
          <span className="truncate text-xs font-semibold text-gray-700">{away.short}</span>
        </div>
      </div>
      <p className="mt-3 truncate text-center text-[11px] text-gray-400">{match.venue}</p>
    </Link>
  );
}
