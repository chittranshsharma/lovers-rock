"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tvgirl_current_slug");
      if (stored && /^[a-z0-9_-]{4,16}$/.test(stored)) {
        router.replace(`/${stored}`);
        return;
      }
      const newSlug = generateSlug();
      localStorage.setItem("tvgirl_current_slug", newSlug);
      router.replace(`/${newSlug}`);
    } catch {
      router.replace(`/${generateSlug()}`);
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center relative overflow-hidden select-none">
      <div className="tv-scanlines opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="space-y-3 text-center z-10 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#151518] border border-white/15 rounded-[2px] text-[10px] font-mono tracking-widest text-[#D9D0BE] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1685] animate-ping" />
          <span>TUNING BROADCAST FREQUENCY</span>
        </div>
      </div>
    </main>
  );
}
