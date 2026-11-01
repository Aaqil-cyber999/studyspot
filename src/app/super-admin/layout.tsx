import { AdminBottomNav } from "@/components/navigation/admin-bottom-nav";

export const dynamic = "force-dynamic";

const items = [
  { href: "/super-admin/dashboard", label: "Dashboard" },
  { href: "/super-admin/universities", label: "Universities" },
  { href: "/super-admin/admins", label: "Admins" },
  { href: "/super-admin/requests", label: "Requests" },
  { href: "/super-admin/locations", label: "Locations" },
  { href: "/super-admin/comments", label: "Comments" },
  { href: "/super-admin/profile", label: "Profile" },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-[412px] bg-white pb-20">
      {children}
      <AdminBottomNav items={items} />
    </div>
  );
}