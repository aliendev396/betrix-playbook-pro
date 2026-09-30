import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Gamepad2,
  Home as HomeIcon,
  Radio,
  Receipt,
  Search,
  User,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BetrixWordmark } from "@/components/brand/Logo";
import { SplashScreen } from "@/components/brand/SplashScreen";
import { SlipContent } from "@/components/slip/PredictionSlip";
import { useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";

const mobileNav = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/games", label: "Casino", icon: Gamepad2 },
  { to: "/history", label: "My Bets", icon: Receipt },
  { to: "/profile", label: "Me", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { slip, isLoggedIn, profile } = useBetrix();
  const [slipOpen, setSlipOpen] = useState(false);

  const isBare = pathname.startsWith("/admin");
  if (isBare) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e11] text-white selection:bg-[#F5C400] selection:text-black font-sans select-none">
      <SplashScreen />
      {/* TOP HEADER (Primestakers Style) */}
      <header className="sticky top-0 z-40 w-full bg-[#0c0c0e] border-b border-[#1f1f26] shadow-md">
        <div className="mx-auto w-full max-w-5xl flex h-14 items-center px-3 md:px-5 gap-3 justify-between">
          {/* Logo */}
          <Link to="/" aria-label="BETRIX home" className="shrink-0 active:scale-95 transition-transform">
            <BetrixWordmark />
          </Link>

          {/* Right Controls: Search, Login, Register */}
          <div className="flex items-center gap-3">
            <Link
              to="/search"
              className="p-1.5 text-gray-300 hover:text-white transition-colors shrink-0"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  to="/auth"
                  className="text-gray-200 font-bold text-xs px-2 py-1.5 hover:text-white tracking-wide"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "signup" } as any}
                  className="bg-[#F5C400] text-black font-black text-xs tracking-wider rounded-md px-3.5 py-1.5 shadow hover:bg-[#e0b300] active:scale-95 transition-all whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="bg-[#1e1e26] text-white border border-[#2a2a35] font-extrabold text-xs tracking-wider rounded-md px-3 py-1.5 shadow hover:bg-[#252530] transition-all flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5 text-[#F5C400]" />
                <span>{profile.phone || "Account"}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="flex-1 w-full max-w-5xl mx-auto">
        <main className="pb-24 md:pb-8">{children}</main>
      </div>

      {/* FLOATING BET SLIP DRAWER (Primestakers Style Sheet Drawer) */}
      <Sheet open={slipOpen} onOpenChange={setSlipOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            id="betslip-trigger"
            aria-label={`Open bet slip with ${slip.length} selections`}
            className="fixed right-4 bottom-20 z-50 flex flex-col items-center justify-center h-14 w-14 rounded-full bg-[#F5C400] text-black shadow-[0_4px_20px_rgba(245,196,0,0.5)] border-2 border-white hover:scale-105 transition-transform"
          >
            <span className="text-lg font-black leading-none">{slip.length}</span>
            <span className="text-[8px] font-black uppercase tracking-tighter text-black">BETSLIP</span>
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className={cn(
            "w-full max-w-lg mx-auto border-[#2a2a35] bg-[#121216] text-white p-0 rounded-t-2xl overflow-hidden shadow-2xl border-t-0 [&>button]:hidden transition-all duration-300",
            slip.length > 0 ? "h-[80vh]" : "h-auto max-h-[50vh]"
          )}
        >
          <SlipContent onDone={() => setSlipOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* MOBILE BOTTOM NAVIGATION BAR (Primestakers Style) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0c0c0e] border-t border-[#1a1a22] shadow-2xl">
        <ul className="grid grid-cols-5 max-w-5xl mx-auto">
          {mobileNav.map((item) => {
            const target = item.to === "/profile" && !isLoggedIn ? "/auth" : item.to;
            return (
              <li key={item.to}>
                <Link
                  to={target}
                  activeOptions={{ exact: item.to === "/" }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold relative text-gray-400 transition-colors",
                    "data-[status=active]:text-[#F5C400] data-[status=active]:font-black"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                          isActive ? "border-2 border-[#F5C400] bg-[#F5C400]/10 text-[#F5C400]" : ""
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
