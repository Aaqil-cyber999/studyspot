import type { Metadata, Viewport } from "next";
import { Geologica, Inter } from "next/font/google";
import { SingleToastManager } from "@/components/shared/single-toast-manager";
import { AuthStoreHydrator } from "@/components/shared/auth-store-hydrator";
import { ServiceWorkerRegister } from "@/components/shared/service-worker-register";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "react-hot-toast";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SpotWise",
  description: "Focus starts with the right place.",
  icons: {
    icon: "/favicon.png",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SpotWise",
  },
};

// Use light/dark theme-color meta to match the user's system scheme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E2E8F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geologica.variable} ${inter.variable} h-full antialiased`}
    >
      {/* data-admin-theme is stamped onto <body> client-side from the persisted
          theme store (see stores/theme-store.ts), so the server render can never
          match it — suppressHydrationWarning is intentional. */}
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          <AuthStoreHydrator />
          <ServiceWorkerRegister />
          {children}
        </QueryProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#0f172a",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
            },
            success: { iconTheme: { primary: "#f97316", secondary: "#ffffff" } },
            error: { iconTheme: { primary: "#dc2626", secondary: "#ffffff" } },
          }}
        />
        <SingleToastManager />
      </body>
    </html>
  );
}