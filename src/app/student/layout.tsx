"use client";

import { usePathname } from "next/navigation";
import { StudentBottomNav } from "@/components/navigation/student-bottom-nav";

export const dynamic = "force-dynamic";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === "/student/login" || pathname === "/student/info" || pathname === "/student/verify" || pathname === "/student/select-university";

  return (
    <div className={`mx-auto min-h-screen w-[412px] bg-white ${hideNav ? "" : "pb-[90px]"}`}>
      {children}
      {!hideNav && <StudentBottomNav />}
    </div>
  );
}