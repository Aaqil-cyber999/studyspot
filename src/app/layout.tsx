import type { Metadata } from "next";
import { Geologica, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geologica.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>{children}</QueryProvider>
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
      </body>
    </html>
  );
}