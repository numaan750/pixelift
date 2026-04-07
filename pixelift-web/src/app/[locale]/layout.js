import LocaleClientEffects from "./LocaleClientEffects";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  return (
    <>
      <LocaleClientEffects locale={locale} />
      {children}
    </>
  );
}
