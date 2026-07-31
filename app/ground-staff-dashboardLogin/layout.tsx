import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function GroundStaffLoginLayout({
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
