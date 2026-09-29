import { cn } from "@/lib/utils";
import type { Team } from "@/data/football";

const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-14 w-14 text-base",
};

export function TeamCrest({
  team,
  size = "md",
  className,
}: {
  team: Team;
  size?: keyof typeof sizes;
  className?: string;
}) {
  if (team?.logo) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white p-0.5 overflow-hidden shadow-xs",
          sizes[size],
          className,
        )}
      >
        <img src={team.logo} alt={team.name} className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border/70 font-bold tracking-tight text-white",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: team?.color || "#333", textShadow: "0 1px 2px rgba(0,0,0,.45)" }}
    >
      {team?.short || "TM"}
    </span>
  );
}

export function LeagueBadge({
  name,
  color,
  className,
}: {
  name: string;
  color: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground", className)}>
      <span className="h-2 w-2 rounded-[3px]" style={{ backgroundColor: color }} />
      <span className="truncate">{name}</span>
    </span>
  );
}
