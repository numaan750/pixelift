import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contectus from "@/components/Contectus";
import { us } from "@/app/constants/us";

export const metadata = {
  title: "Contact – AI Soulmate Drawings",
  description: "Contact AI Soulmate Drawings support and team.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <>
      <Navbar navLinks={us.navLinks} country="us" />
      <Contectus contact={us.contact} />
      <Footer footer={us.footer} country="us" />
    </>
  );
}
