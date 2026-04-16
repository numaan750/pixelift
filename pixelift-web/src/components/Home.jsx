import Image from "next/image";
import { useState, useEffect } from "react";
import { altFromSrcOrAlt } from "@/lib/altText";
import { FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Home = ({ hero, country }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handlePortalClick = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push("/portal/dashboard");
    } else {
      router.push("/portal/login?mode=signup");
    }
  };
  return (
    <section
      id="home"
      className="bg-[#12171B] text-white min-h-[90vh] flex flex-col justify-center items-center relative overflow-hidden"
    >
      <div className="mycontainer flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="flex-1 flex flex-col gap-6 sm:gap-8 max-w-xl text-start md:text-left relative z-10 mt-5">
          <h1 className="text-[32px] sm:text-[40px] lg:text-[50px] font-bold leading-tight">
            {hero?.title} <br />
          </h1>

          <p className="text-[#FFFFFF] text-[18px] sm:text-[24px] leading-relaxed ">
            {hero?.description}
          </p>

          <div className="flex flex-wrap gap-3 justify-start">
            <button
              onClick={handlePortalClick}
              className="relative group cursor-pointer overflow-hidden inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] text-white font-medium px-5 sm:px-6 py-3 rounded-full w-fit transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 text-[14px] sm:text-[16px]">
                {isLoggedIn ? "Dashboard" : hero?.buttonText}
              </span>
              <span className="absolute inset-0 -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-700 bg-gradient-to-br from-transparent via-white/20 to-transparent" />
            </button>
            <a
              href="https://apps.apple.com/us/app/pixelift-ai-photo-enhancer/id6748871047"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="relative group cursor-pointer overflow-hidden inline-flex items-center justify-center gap-2 bg-[#12171B] text-white border border-white/20 font-medium px-5 sm:px-6 py-3 rounded-full w-fit hover:bg-neutral-900 transition transition-all duration-300 hover:scale-105">
                <FaApple className="relative z-10 text-lg" />
                <span className="relative z-10 text-[14px] sm:text-[16px] whitespace-nowrap">
                  Get the App
                </span>
                <span className="absolute inset-0 -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-700 bg-gradient-to-br from-transparent via-white/20 to-transparent" />
              </button>
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center max-sm:min-h-[350px] md:justify-end relative z-10">
          <Image
            src={hero?.image}
            alt={altFromSrcOrAlt({
              alt: hero?.alt,
              src: hero?.image,
              locale: country,
            })}
            width={500}
            height={500}
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 500px"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
