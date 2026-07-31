import DocAdminNav from "@/components/DocAdminNav";
import DoctorAdminProtected from "@/components/DoctorAdminProtected";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DoctorAdminProtected>
      <div className="flex">
        <DocAdminNav />
        <main className="min-h-screen flex-1 bg-slate-50">
          {children}
        </main>
      </div>
    </DoctorAdminProtected>
  );
}
