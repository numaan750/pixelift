"use client";
import Link from "next/link";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { altFromSrcOrAlt } from "@/lib/altText";
import { SUPPORT_EMAIL } from "@/lib/site";

const FOOTER_I18N = {
  us: {
    privacy: "Privacy Policy",
    terms: "Terms and Conditions",
    acceptableUse: "Acceptable Use",
    pricing: "Pricing",
    manage: "Manage Subscription",
    blog: "Blog",
    support: "Support",
  },
  uk: {
    privacy: "Privacy Policy",
    terms: "Terms and Conditions",
    acceptableUse: "Acceptable Use",
    pricing: "Pricing",
    manage: "Manage Subscription",
    blog: "Blog",
    support: "Support",
  },
  de: {
    privacy: "Datenschutz",
    terms: "Allgemeine Geschäftsbedingungen",
    acceptableUse: "Zulässige Nutzung",
    pricing: "Preise",
    manage: "Abo verwalten",
    blog: "Blog",
    support: "Support",
  },
  fr: {
    privacy: "Politique de confidentialité",
    terms: "Conditions générales",
    acceptableUse: "Utilisation acceptable",
    pricing: "Tarifs",
    manage: "Gérer l'abonnement",
    blog: "Blog",
    support: "Support",
  },
  it: {
    privacy: "Informativa sulla privacy",
    terms: "Termini e condizioni",
    acceptableUse: "Uso accettabile",
    pricing: "Prezzi",
    manage: "Gestisci abbonamento",
    blog: "Blog",
    support: "Supporto",
  },
  br: {
    privacy: "Política de privacidade",
    terms: "Termos e condições",
    acceptableUse: "Uso aceitável",
    pricing: "Preços",
    manage: "Gerenciar assinatura",
    blog: "Blog",
    support: "Suporte",
  },
  mx: {
    privacy: "Política de privacidad",
    terms: "Términos y condiciones",
    acceptableUse: "Uso aceptable",
    pricing: "Precios",
    manage: "Administrar suscripción",
    blog: "Blog",
    support: "Soporte",
  },
  cn: {
    privacy: "隐私政策",
    terms: "条款与条件",
    acceptableUse: "可接受使用",
    pricing: "定价",
    manage: "管理订阅",
    blog: "博客",
    support: "支持",
  },
  jp: {
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    acceptableUse: "利用ポリシー",
    pricing: "料金",
    manage: "サブスクリプション管理",
    blog: "ブログ",
    support: "サポート",
  },
  ru: {
    privacy: "Политика конфиденциальности",
    terms: "Условия и положения",
    acceptableUse: "Допустимое использование",
    pricing: "Тарифы",
    manage: "Управление подпиской",
    blog: "Блог",
    support: "Поддержка",
  },
  vn: {
    privacy: "Chính sách quyền riêng tư",
    terms: "Điều khoản và điều kiện",
    acceptableUse: "Sử dụng chấp nhận được",
    pricing: "Bảng giá",
    manage: "Quản lý gói",
    blog: "Blog",
    support: "Hỗ trợ",
  },
  sa: {
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
    acceptableUse: "الاستخدام المقبول",
    pricing: "الأسعار",
    manage: "إدارة الاشتراك",
    blog: "المدونة",
    support: "الدعم",
  },
};

function getFooterI18n(country) {
  const code = typeof country === "string" ? country.toLowerCase() : "";
  return FOOTER_I18N[code] || FOOTER_I18N.us;
}

const Footer = ({ footer, country, supportEmail = SUPPORT_EMAIL }) => {
  const pathname = usePathname();
  const i18n = getFooterI18n(country);

  const privacyLabel =
    footer?.page1 ??
    footer?.links?.find((l) => /privacy|privac/i.test(l?.label ?? ""))?.label ??
    i18n.privacy;

  const termsLabel =
    footer?.page2 ??
    footer?.links?.find((l) => /terms|condition/i.test(l?.label ?? ""))
      ?.label ??
    i18n.terms;

  const footerText = footer?.text ?? footer?.copyright ?? footer?.description;

  const handleHomeClick = (e) => {
    e.preventDefault();

    if (pathname === "/") {
      scrollToSection("home");
    } else {
      router.push("/");

      setTimeout(() => {
        scrollToSection("home");
      }, 300);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const navbarHeight = 80;
    const y =
      element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };
  const handleFooterClick = (e, targetId) => {
    e.preventDefault();

    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 80; // same offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 bg-[#12171B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            <Image
              src="/home-images/pixellift.png"
              alt={altFromSrcOrAlt({ alt: "pixellift", locale: country })}
              width={48}
              height={48}
              className="rounded-xl"
            />
          </div>

          <p className="text-[24px] sm:text-[30px] md:text-[40px] font-bold">
            {footer?.title}
          </p>

          <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-[16px] sm:text-[18px]">
            <Link
              href="/privecypolice"
              className="hover:text-blue-400 transition-colors"
            >
              {privacyLabel}
            </Link>
            <Link
              href="/conditions"
              className="hover:text-blue-400 transition-colors"
            >
              {termsLabel}
            </Link>
            <Link
              href="/blog"
              className="hover:text-blue-400 transition-colors"
            >
              {i18n.blog}
            </Link>
            <Link
              href="/acceptable-use"
              className="hover:text-blue-400 transition-colors"
            >
              {i18n.acceptableUse}
            </Link>
            <Link
              href="/pricing"
              className="hover:text-blue-400 transition-colors"
            >
              {i18n.pricing}
            </Link>
            <Link
              href="/manage-subscription"
              className="hover:text-blue-400 transition-colors"
            >
              {i18n.manage}
            </Link>
          </nav>

          <p className="text-[16px] sm:text-[18px] text-white/70 max-w-xs sm:max-w-md">
            {footerText}
          </p>

          {supportEmail && (
            <p className="text-[14px] sm:text-[16px] text-white">
              {i18n.support}:{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="underline hover:text-blue-400 transition-colors"
              >
                {supportEmail}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
