import { StudentBottomNav } from "@/components/navigation/student-bottom-nav";

export const dynamic = "force-dynamic";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-white pb-[90px]">
      {children}
      <StudentBottomNav />
    </div>
  );
}