"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/Appcontext";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { authenticated, authLoading } = useContext(AppContext);

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.replace("/login");
    }
  }, [authenticated, authLoading, router]);

  if (authLoading) {
    return (
     <div className="min-h-screen flex items-center justify-center bg-[#12171B]">
        <div className="w-12 h-12 border-4 border-[#AABFFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#12171B]">
        <div className="w-12 h-12 border-4 border-[#AABFFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
