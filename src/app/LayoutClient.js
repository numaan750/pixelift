"use client";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function LayoutClient({ children }) {
  const { language } = useContext(AppContext);

  return (
    <>
      <Navbar navLinks={language?.navLinks} />
      {children}
      <Footer footer={language?.footer} />
    </>
  );
}