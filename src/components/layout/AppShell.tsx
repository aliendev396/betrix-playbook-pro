import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  History as HistoryIcon,
  Home,
  Menu,
  Radio,
  Search,
  Ticket,
  Trophy,
  User,
  CalendarDays,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BetrixWordmark } from "@/components/brand/Logo";
import { SlipContent } from "@/components/slip/PredictionSlip";
import { formatPoints, useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";

const desktopNav = [
  { to: "/", label: "Home" },
  { to: "/live", label: "Live" },
  { to: "/matches", label: "Football" },
  { to: "/leagues", label: "Leagues" },
  { to: "/predictions", label: "My Predictions" },
  { to: "/history", label: "History" },
] as const;

const mobileNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/matches", label: "Matches", icon: CalendarDays },
  { to: "/predictions", label: "Predictions", icon: Ticket },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { points, slip, notifications } = useBetrix();
  const [slipOpen, setSlipOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const bare = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  if (bare) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 lg:px-6">
          <Link to="/" aria-label="BETRIX home" className="flex items-center">
            <BetrixWordmark />
          </Link>

          <nav className="hidden items-center justify-center gap-1 lg:flex">
            {desktopNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1.5">
            <Button asChild variant="ghost" size="icon" aria-label="Search">
              <Link to="/search">
                <Search className="h-[18px] w-[18px]" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Link to="/notifications">
                <Bell className="h-[18px] w-[18px]" />
                {unread > 0 ? (
                  <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {unread}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Link
              to="/points"
              className="tabular hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary/20 sm:inline-flex"
            >
              {formatPoints(points)}
              <span className="text-[10px] font-semibold tracking-wider opacity-70">PTS</span>
            </Link>
            <Button asChild variant="ghost" size="icon" aria-label="Profile" className="hidden sm:inline-flex">
              <Link to="/profile">
                <User className="h-[18px] w-[18px]" />
              </Link>
            </Button>

            <Sheet open={slipOpen} onOpenChange={setSlipOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Prediction slip" className="relative lg:hidden">
                  <Ticket className="h-[18px] w-[18px]" />
                  {slip.length > 0 ? (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                      {slip.length}
                    </span>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl border-border bg-surface p-0">
                <SheetHeader className="border-b border-border px-4 py-3 text-left">
                  <SheetTitle>Prediction Slip</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(85vh-57px)]">
                  <SlipContent onDone={() => setSlipOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu" className="lg:hidden">
                  <Menu className="h-[18px] w-[18px]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-surface">
                <SheetHeader className="text-left">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col gap-1">
                  {[...desktopNav, { to: "/code", label: "Load Prediction Code" }, { to: "/points", label: "Virtual Points" }, { to: "/partners", label: "Partners & Referrals" }, { to: "/profile", label: "Profile" }, { to: "/auth", label: "Sign In" }, { to: "/admin", label: "Admin Dashboard" }].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[status=active]:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-28 pt-4 lg:px-6 lg:pb-12">
        <main className="min-w-0 flex-1">{children}</main>
        <aside className="hidden w-[340px] shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Ticket className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Prediction Slip</h2>
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-auto">
              <SlipContent />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {mobileNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className={cn(
                  "group flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors",
                  "data-[status=active]:text-primary",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export { Trophy, HistoryIcon };
