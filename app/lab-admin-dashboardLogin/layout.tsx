import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LabAdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
