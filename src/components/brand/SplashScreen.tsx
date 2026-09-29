import React, { useEffect, useState } from "react";

export function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090c] text-white animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-5 animate-pulse">
        {/* Gold Emblem Logo */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-[#F5C400]/20 blur-xl animate-pulse" />
          <img
            src="/logo.jpg"
            alt="BETRIX Logo"
            className="relative w-28 h-28 rounded-full object-cover border-2 border-[#F5C400] shadow-[0_0_30px_rgba(245,196,0,0.6)]"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black tracking-widest text-[#F5C400] drop-shadow-[0_2px_10px_rgba(245,196,0,0.4)] uppercase">
            BETRIX
          </h1>
          <p className="text-xs uppercase font-extrabold tracking-[0.25em] text-gray-400">
            Sports &amp; Casino
          </p>
        </div>

        {/* Loader Bar */}
        <div className="w-36 h-1 bg-[#1c1c24] rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-[#F5C400] via-[#ffd940] to-[#F5C400] w-full animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}
