"use client";
import { createContext, useEffect, useState } from "react";
import { us } from "../constants/us";
import { ru } from "../constants/ru";
import { de } from "../constants/de";
import { uk } from "../constants/uk";
import { cn } from "../constants/cn";
import { br } from "../constants/br";
import { jp } from "../constants/jp";
import { mx } from "../constants/mx";
import { fr } from "../constants/fr";
import { vn } from "../constants/vn";
import { it } from "../constants/it";
import { sa } from "../constants/sa";
import { useRouter } from "next/navigation";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [country, setCountry] = useState(); // Add this line
  const [language, setLanguage] = useState(us);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const contentMap = { us, ru, de, uk, cn, br, jp, mx, fr, vn, it, sa: us };

  // Geo detection and geo redirects are handled in Next.js Middleware.
  // This context stays as a simple place to store UI language when needed.

  const value = {
    country,
    language,
    setLanguage,
    loading,
    setLoading
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export { AppContextProvider };
