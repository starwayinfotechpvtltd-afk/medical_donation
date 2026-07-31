import PatientAdminProtected from '@/components/PatientAdminProtected';

export default function PatientAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PatientAdminProtected>
      <div className="min-h-screen bg-gray-50">
        <main>{children}</main>
      </div>
    </PatientAdminProtected>
  );
}
