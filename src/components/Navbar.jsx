"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { altFromSrcOrAlt } from "@/lib/altText";

const Navbar = ({ navLinks, country }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setOpen(false);

    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const scrollOrRoute = (e, targetId, route = "/") => {
    e.preventDefault();
    setOpen(false);

    // Don't force users from '/' to '/us' (or any locale). Root should stay selectable.
    const effectiveRoute =
      route === "/" && country && pathname !== "/" ? `/${country}` : route;

    const element = document.getElementById(targetId);

    if (element && pathname === effectiveRoute) {
      const navbarHeight = 80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    } else {
      router.push(effectiveRoute);
      if (element) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (!el) return;
          const navbarHeight = 80;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 300);
      }
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-[#12171B] bg-opacity-70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`bg-[#12171B] text-white sticky top-0 h-[10vh] z-50  ${
          scrolled ? "shadow-lg backdrop-blur-md bg-opacity-90" : ""
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mycontainer py-4 md:py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-16">
            <Link
              href="/"
              onClick={(e) => {
                scrollOrRoute(e, "home", "/");
              }}
            >
              <div className="w-12 h-12 md:w-12 md:h-12">
                <Image
                  src="/home-images/pixellift.png"
                  alt={altFromSrcOrAlt({ alt: "pixellift", locale: country })}
                  width={48}
                  height={48}
                  className="rounded-xl"
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-10 text-[16px] sm:text-[16px]">
              {navLinks.map((link) => (
                <a
                  key={link.targetId}
                  href={link.route}
                  onClick={(e) => scrollOrRoute(e, link.targetId, link.route)}
                  className="hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => router.push("/portal/login")}
              className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/portal/login?mode=signup")}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-medium"
            >
              Sign Up
            </button>
          </div>

          <button
            className="md:hidden text-3xl z-50 relative"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-[#12171B]/50 px-6 py-6 space-y-4 relative z-50 text-white">
            {navLinks.map((link) => (
              <a
                key={link.targetId}
                href={link.route}
                onClick={(e) => scrollOrRoute(e, link.targetId, link.route)}
                className="block text-lg hover:text-blue-400 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => router.push("/portal/login")}
                className="w-full py-3 rounded-full border border-white/20 text-white"
              >
                Login
              </button>

              <button
                onClick={() => router.push("/portal/login?mode=signup")}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
