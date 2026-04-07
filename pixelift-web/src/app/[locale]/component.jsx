"use client";

import React from "react";
import Main from "@/main/Main";
import { getCountryContent } from "@/lib/countryContent";

const Component = ({ locale }) => {
  const text = getCountryContent(locale);

  return <Main lang={text} country={locale} />;
};

export default Component;
