import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Dices,
  Home,
  Menu,
  Radio,
  Search,
  Ticket,
  Trophy,
  User,
  Wallet,
  History as HistoryIcon,
  Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BetrixWordmark } from "@/components/brand/Logo";
import { SlipContent } from "@/components/slip/PredictionSlip";
import { formatPoints, useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";

const sideNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/sports", label: "All Sports", icon: Trophy },
  { to: "/casino", label: "Arcade", icon: Dices },
  { to: "/history", label: "My Predictions", icon: HistoryIcon },
  { to: "/profile", label: "Account", icon: User },
] as const;

const moreNav = [
  { to: "/matches", label: "Football Fixtures" },
  { to: "/leagues", label: "Leagues" },
  { to: "/code", label: "Load Prediction Code" },
  { to: "/points", label: "Virtual Points" },
  { to: "/partners", label: "Partners & Referrals" },
  { to: "/notifications", label: "Notifications" },
  { to: "/auth", label: "Sign In / Register" },
  { to: "/admin", label: "Admin Dashboard" },
] as const;

const mobileNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/sports", label: "Sports", icon: Trophy },
  { to: "/casino", label: "Arcade", icon: Dices },
  { to: "/profile", label: "Account", icon: User },
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
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto bg-surface">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1">
                {[...sideNav, ...moreNav].map((item) => (
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

          <Link to="/" aria-label="BETRIX home" className="flex items-center">
            <BetrixWordmark />
          </Link>

          <div className="ml-auto flex items-center gap-1.5">
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
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild size="sm" className="font-bold">
              <Link to="/auth">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-5 px-3 pb-28 pt-4 lg:px-6 lg:pb-10">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            {sideNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground data-[status=active]:border-l-2 data-[status=active]:border-primary data-[status=active]:bg-surface data-[status=active]:text-primary"
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            ))}
            <div className="!mt-5 space-y-0.5 border-t border-border pt-4">
              {moreNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="!mt-6 flex items-center gap-1.5 px-3 text-[10px] leading-relaxed text-muted-foreground">
              <Users className="h-3 w-3 shrink-0" /> Virtual points only — no real money.
            </p>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Floating slip button */}
      <Sheet open={slipOpen} onOpenChange={setSlipOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label={`Prediction slip, ${slip.length} selections`}
            className="glow-ring fixed bottom-20 right-4 z-50 grid h-16 w-16 place-items-center rounded-full brand-gradient text-primary-foreground transition-transform active:scale-95 lg:bottom-6"
          >
            <span className="tabular text-lg font-extrabold leading-none">{slip.length}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider">Slip</span>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full border-border bg-surface p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle className="flex items-center gap-2 text-base">
              <Ticket className="h-4 w-4 text-primary" /> Prediction Slip
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100dvh-57px)]">
            <SlipContent onDone={() => setSlipOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {mobileNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors",
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

      <footer className="hidden border-t border-border px-6 py-8 text-center text-xs text-muted-foreground lg:block">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-2">
          <BetrixWordmark className="scale-90" />
          <p>© {new Date().getFullYear()} BETRIX · Entertainment platform using virtual points only. 18+.</p>
        </div>
      </footer>
    </div>
  );
}

export { Trophy, HistoryIcon, Wallet };
