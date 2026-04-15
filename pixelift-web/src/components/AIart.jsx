import Image from "next/image";
import React from "react";
import { altFromSrcOrAlt } from "@/lib/altText";

const AIart = ({ aiArt, country }) => {
  const galleryColumns = [
    [aiArt?.img1, aiArt?.img2, aiArt?.img3],
    [aiArt?.img4, aiArt?.img5, aiArt?.img6, aiArt?.img7],
    [aiArt?.img8, aiArt?.img9, aiArt?.img10],
  ];

  const hasGalleryImages = galleryColumns.some((col) =>
    col.some((img) => Boolean(img?.url)),
  );

  const hasFeatureCards =
    Array.isArray(aiArt?.features) && aiArt.features.length > 0;

  return (
    <div className="bg-[#12171B] text-white flex flex-col items-center pt-5 pb-10 lg:py-25">
      <div className="mycontainer ">
        <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-bold mb-2 text-center">
          {aiArt?.title}
        </h2>

        <p className="text-[16px] sm:text-[18px] text-white max-w-2xl text-center mb-12 mx-auto">
          {aiArt?.description}
        </p>

        {hasGalleryImages ? (
          <div className="grid grid-cols-1  md:grid-cols-3 lg-grid-cols-3 md-grid-col-3 gap-4 shrink-0">
            <div className="flex flex-col gap-6">
              {aiArt?.img1?.url && (
                <div className="overflow-hidden h-[550px]">
                  <Image
                    src={aiArt.img1.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img1?.alt,
                      src: aiArt?.img1?.url,
                      locale: country,
                    })}
                    width={400}
                    height={550}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
              {aiArt?.img2?.url && (
                <div className="overflow-hidden h-[550px]">
                  <Image
                    src={aiArt.img2.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img2?.alt,
                      src: aiArt?.img2?.url,
                      locale: country,
                    })}
                    width={400}
                    height={550}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
              {aiArt?.img3?.url && (
                <div className="overflow-hidden h-[640px]">
                  <Image
                    src={aiArt.img3.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img3?.alt,
                      src: aiArt?.img3?.url,
                      locale: country,
                    })}
                    width={400}
                    height={640}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {aiArt?.img4?.url && (
                <div className="overflow-hidden h-[360px]">
                  <Image
                    src={aiArt.img4.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img4?.alt,
                      src: aiArt?.img4?.url,
                      locale: country,
                    })}
                    width={400}
                    height={360}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
              {aiArt?.img5?.url && (
                <div className="overflow-hidden h-[450px]">
                  <Image
                    src={aiArt.img5.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img5?.alt,
                      src: aiArt?.img5?.url,
                      locale: country,
                    })}
                    width={400}
                    height={450}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
              {aiArt?.img6?.url && (
                <div className="overflow-hidden h-[450px]">
                  <Image
                    src={aiArt.img6.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img6?.alt,
                      src: aiArt?.img6?.url,
                      locale: country,
                    })}
                    width={400}
                    height={450}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
              {aiArt?.img7?.url && (
                <div className="overflow-hidden h-[450px]">
                  <Image
                    src={aiArt.img7.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img7?.alt,
                      src: aiArt?.img7?.url,
                      locale: country,
                    })}
                    width={400}
                    height={450}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {aiArt?.img8?.url && (
                <div className="overflow-hidden h-[580px]">
                  <Image
                    src={aiArt.img8.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img8?.alt,
                      src: aiArt?.img8?.url,
                      locale: country,
                    })}
                    width={400}
                    height={580}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
              {aiArt?.img9?.url && (
                <div className="overflow-hidden h-[550px]">
                  <Image
                    src={aiArt.img9.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img9?.alt,
                      src: aiArt?.img9?.url,
                      locale: country,
                    })}
                    width={400}
                    height={550}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
              {aiArt?.img10?.url && (
                <div className="overflow-hidden h-[600px]">
                  <Image
                    src={aiArt.img10.url}
                    alt={altFromSrcOrAlt({
                      alt: aiArt?.img10?.alt,
                      src: aiArt?.img10?.url,
                      locale: country,
                    })}
                    width={400}
                    height={600}
                    className="w-full h-full object-cover rounded-4xl border border-[#2D3845]"
                  />
                </div>
              )}
            </div>
          </div>
        ) : hasFeatureCards ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiArt.features.map((feature, index) => (
              <div key={index} className="flex flex-col gap-3">
                {feature?.image && (
                  <div className="overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={altFromSrcOrAlt({
                        alt: feature?.alt,
                        src: feature?.image,
                        locale: country,
                      })}
                      width={500}
                      height={350}
                      className="w-full h-auto object-cover rounded-4xl border border-[#2D3845]"
                    />
                  </div>
                )}
                {feature?.title && (
                  <h3 className="text-[18px] sm:text-[20px] font-semibold">
                    {feature.title}
                  </h3>
                )}
                {feature?.description && (
                  <p className="text-[14px] sm:text-[16px] text-gray-300">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AIart;

