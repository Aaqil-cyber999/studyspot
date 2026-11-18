import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = {
  title: "SpotWise — Offline",
};

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#E2E8F0] px-6 text-center">
      <span className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/welcome/logo.png"
          alt="SpotWise"
          className="h-14 w-14 object-contain"
        />
      </span>
      <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-orange-100">
        <WifiOff className="size-5 text-orange-600" aria-hidden="true" />
      </div>
      <h1 className="text-xl font-bold text-[#0f172a]">You&rsquo;re offline</h1>
      <p className="mt-2 max-w-[280px] text-sm leading-6 text-[#64748b]">
        SpotWise needs a connection to work. Please reconnect and try again.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#f97316] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#ea6a0f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
      >
        Try again
      </Link>
    </main>
  );
}
