import { countries } from "@/lib/countries";
import { SITE_URL } from "@/lib/site";

export default function Hreflang({ current }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || SITE_URL;

  return (
    <>
      {Object.entries(countries).map(([code, c]) => (
        <link
          key={code}
          rel="alternate"
          hrefLang={c.lang}
          href={code === "us" ? baseUrl : `${baseUrl}/${code}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />
    </>
  );
}
