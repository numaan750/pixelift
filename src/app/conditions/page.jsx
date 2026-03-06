import TermsConditions from '@/components/Conditions'
import React from 'react'
import { ru } from "../constants/ru";
import { us } from "../constants/us";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Terms & Conditions – AI Soulmate Drawings",
  description: "Read the Terms & Conditions for AI Soulmate Drawings.",
  alternates: { canonical: "/conditions" },
  robots: { index: true, follow: true },
};

const contentMap = {
  us: us,
  ru: ru,
};

const page = async({ params }) => {
  const { slug } = await params;
  const text = contentMap[slug] || us;
  return (
    <div>
        <Navbar navLinks={text?.navLinks} />
        <TermsConditions />
        <Footer footer={text?.footer} />
    </div>
  )
}

export default page