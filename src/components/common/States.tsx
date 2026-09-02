import type { ReactNode } from "react";
import { AlertTriangle, Inbox, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="surface-card rounded-2xl p-4">
          <Skeleton className="h-3 w-24 bg-muted" />
          <div className="mt-3 flex items-center justify-between gap-3">
            <Skeleton className="h-9 w-9 rounded-full bg-muted" />
            <Skeleton className="h-4 w-32 bg-muted" />
            <Skeleton className="h-9 w-9 rounded-full bg-muted" />
          </div>
          <Skeleton className="mt-4 h-9 w-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center rounded-2xl px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="surface-card flex flex-col items-center rounded-2xl px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/15 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold">Something went wrong</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {message ?? "We couldn't load this data. Please try again."}
      </p>
      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCw className="mr-2 h-4 w-4" /> Try again
        </Button>
      ) : null}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</h2>
      {action}
    </div>
  );
}
