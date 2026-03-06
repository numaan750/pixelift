import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PrivacyPolicy from "@/components/Privecypolice";
import React from "react";
import { ru } from "../constants/ru";
import { us } from "../constants/us";

export const metadata = {
  title: "Privacy Policy – AI Soulmate Drawings",
  description: "Read the Privacy Policy for AI Soulmate Drawings.",
  alternates: { canonical: "/privecypolice" },
  robots: { index: true, follow: true },
};

const contentMap = {
  us: us,
  ru: ru,
};

const page = async ({ params }) => {
  const { slug } = await params;
    const text = contentMap[slug] || us;
  return (
    <div>
      <Navbar navLinks={text?.navLinks} />
      <PrivacyPolicy />
      <Footer footer={text?.footer} />
    </div>
  );
};

export default page;
