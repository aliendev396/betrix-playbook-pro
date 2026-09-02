import logo from "@/assets/betrix-logo.png.asset.json";
import mark from "@/assets/betrix-mark.png.asset.json";
import { cn } from "@/lib/utils";

/** Full BETRIX wordmark on a light plate so the original artwork stays untouched. */
export function BetrixWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg bg-white px-2.5 py-1.5 shadow-sm",
        className,
      )}
    >
      <img src={logo.url} alt="BETRIX" className="h-4 w-auto sm:h-5" />
    </span>
  );
}

/** Compact shield mark on a light plate. */
export function BetrixMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center rounded-xl bg-white p-1.5", className)}>
      <img src={mark.url} alt="BETRIX" className="h-full w-full object-contain" />
    </span>
  );
}

export const betrixLogoUrl = logo.url;
export const betrixMarkUrl = mark.url;
