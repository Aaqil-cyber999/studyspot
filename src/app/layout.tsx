import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SpotWise",
  description: "Focus starts with the right place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geologica.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}