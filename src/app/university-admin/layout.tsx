import { AdminBottomNav } from "@/components/navigation/admin-bottom-nav";

export const dynamic = "force-dynamic";

const items = [
  { href: "/university-admin/dashboard", label: "Dashboard" },
  { href: "/university-admin/locations", label: "Locations" },
  { href: "/university-admin/comments", label: "Reviews" },
  { href: "/university-admin/profile", label: "Profile" },
];

export default function UniversityAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-[412px] bg-white pb-20">
      {children}
      <AdminBottomNav items={items} />
    </div>
  );
}