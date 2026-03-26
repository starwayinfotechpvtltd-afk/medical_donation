"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, ShieldCheck, Activity, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/manage-roles", label: "Manage Roles", icon: ShieldCheck },
    { href: "/admin/manage-users", label: "Manage Users", icon: Users },
    { href: "/admin/activity-logs", label: "Activity Logs", icon: Activity },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-100 to-blue-100 text-slate-900 h-screen sticky top-0 overflow-y-auto border-r border-indigo-200">
      <div className="p-6 border-b border-indigo-200">
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-600 text-sm">Medical Care Hospital</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-700 hover:bg-indigo-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-200 space-y-2">
        <div className="px-4 py-2 text-sm">
          <p className="font-semibold text-slate-900">{user?.name}</p>
          <p className="text-slate-600">{user?.department}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
