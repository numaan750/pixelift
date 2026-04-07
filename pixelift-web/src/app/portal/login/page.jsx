import Login from "@/components/login/Login";
import Navbar from "@/components/Navbar";
import React from "react";

import { us } from "@/app/constants/us";
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div>
      <Navbar navLinks={us.navLinks} country="us" />
      <Login />
      <Footer footer={us.footer} country="us" />
    </div>
  );
};

export default page;
