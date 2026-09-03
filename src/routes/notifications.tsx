import { createFileRoute } from "@tanstack/react-router";
import { Bell, CalendarClock, Megaphone, Ticket, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionHeading } from "@/components/common/States";
import { useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — BETRIX" },
      { name: "description", content: "Prediction results, kickoff reminders and BETRIX platform announcements in one place." },
      { property: "og:title", content: "Notifications — BETRIX" },
      { property: "og:description", content: "Stay updated on results, matches and BETRIX announcements." },
    ],
  }),
  component: NotificationsPage,
});

const icons = { result: Trophy, match: CalendarClock, code: Ticket, system: Megaphone } as const;

function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useBetrix();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <SectionHeading title="Notifications" subtitle={unread ? `${unread} unread` : "All caught up"} />
        {unread > 0 ? (
          <Button variant="outline" size="sm" className="shrink-0" onClick={markAllRead}>
            Mark all read
          </Button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="Nothing here yet" description="Results and match alerts will show up here." icon={<Bell className="h-5 w-5" />} />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = icons[n.kind];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={cn(
                  "surface-card grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl p-4 text-left transition-colors",
                  !n.read && "border-primary/40",
                )}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{n.title}</span>
                    {!n.read ? <span className="h-2 w-2 shrink-0 rounded-full bg-primary" /> : null}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{n.time}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
