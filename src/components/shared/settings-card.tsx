"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/theme-store";

/**
 * Shared Settings card used by the university-admin and student profile tabs:
 * a single Appearance row (light/dark toggle, wired to the shared theme store).
 */
export function SettingsCard() {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <section
      id="profile-settings"
      className="scroll-mt-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
    >
      <div>
        <h2 className="text-sm font-bold text-[#0f172a]">Settings</h2>
      </div>
      <div className="mt-3">
        <PreferenceRow
          icon={isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          title="Appearance"
          description={isDark ? "Dark mode is on" : "Light mode is on"}
        >
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            {isDark ? "Light" : "Dark"}
          </button>
        </PreferenceRow>
      </div>
    </section>
  );
}

function PreferenceRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-preference-row flex items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-3 first:border-t-0 first:pt-3 last:pb-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}
