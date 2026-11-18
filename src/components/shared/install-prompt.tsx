"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { X, Download, Share } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Custom PWA install banner for mobile visitors.
 *
 * Two modes, chosen at runtime:
 *  - Chromium (Android Chrome/Edge): captures `beforeinstallprompt` and shows
 *    a native-backed Install button.
 *  - iOS Safari: Apple gives no install API, so it shows manual
 *    "Share -> Add to Home Screen" instructions instead.
 *
 * Never shown when the app already runs standalone, on md+ screens, or after
 * the user dismissed the banner (persisted so it doesn't nag every visit).
 */

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Read the prompt captured synchronously by the inline script in <body>. */
function readDeferredPrompt(): InstallEvent | null {
  if (typeof window === "undefined") return null;
  return ((window as unknown as { __deferredInstallPrompt?: InstallEvent | null }).__deferredInstallPrompt ??
    null);
}

const DISMISS_KEY = "spotwise-install-dismissed";

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIpad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return /iPad|iPhone|iPod/.test(ua) || isIpad;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

function dismissalRecord() {
  try {
    return window.localStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
}

/** Read a client-only value without an effect or a hydration mismatch. */
function useClientValue<T>(getClient: () => T, getServer: () => T): T {
  return useSyncExternalStore(
    () => () => {},
    getClient,
    getServer,
  );
}

export function InstallPrompt() {
  // Server snapshots deliberately report "installed/dismissed" so the banner
  // renders nothing on the server and never flashes in on hydration.
  const isIos = useClientValue(isIosDevice, () => false);
  const standalone = useClientValue(isStandalone, () => true);
  const dismissedAt = useClientValue(dismissalRecord, () => "dismissed");

  const [deferredPrompt, setDeferredPrompt] = useState<InstallEvent | null>(() => readDeferredPrompt());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const grab = () => {
      const captured = readDeferredPrompt();
      if (captured) setDeferredPrompt(captured);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      (window as unknown as { __deferredInstallPrompt?: InstallEvent | null }).__deferredInstallPrompt = null;
      toast.success("SpotWise installed");
    };
    // The inline head script stores the event and dispatches this; we only
    // need to re-read it here. Anything Chromium fired before we mounted was
    // already picked up by the lazy useState initializer.
    window.addEventListener("spotwise-install-available", grab);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("spotwise-install-available", grab);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const visible = !standalone && !dismissed && dismissedAt === null && (isIos || deferredPrompt !== null);
  if (!visible) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Non-fatal — banner just reappears on the next visit.
    }
  };

  const install = async () => {
    if (!deferredPrompt) return;
    setDeferredPrompt(null);
    (window as unknown as { __deferredInstallPrompt?: InstallEvent | null }).__deferredInstallPrompt = null;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome !== "accepted") {
      try {
        window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        // Non-fatal.
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Install SpotWise app"
      className="fixed inset-x-0 bottom-4 z-50 mx-auto w-[calc(100%-32px)] max-w-[412px] md:hidden"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.18)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192.png"
          alt="SpotWise"
          className="h-11 w-11 shrink-0 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight text-[#0f172a]">
            Install SpotWise
          </p>
          <p className="mt-0.5 text-[11px] leading-snug text-[#64748b]">
            {isIos ? (
              <>Tap <Share className="inline size-3 align-[-1px]" aria-label="the Share icon" /> Share, then &ldquo;Add to Home Screen&rdquo;</>
            ) : (
              "Add to your home screen for the full app experience."
            )}
          </p>
        </div>

        {isIos ? (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install hint"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
          >
            <X className="size-5" />
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Not now"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={install}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#f97316] px-3.5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(249,115,22,0.35)] transition-colors hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            >
              <Download className="size-4" />
              Install
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
