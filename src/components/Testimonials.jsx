import React from "react";
import { UserIcon } from "@heroicons/react/24/solid";

const Testimonials = ({ testimonial }) => {
  const items =
    testimonial?.testimonials ??
    testimonial?.reviews?.map((r) => ({
      text: r?.review,
      name: r?.name,
    })) ??
    [];

  return (
    <div className="bg-[#12171B] text-white py-20">
      <div className="mycontainer">
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <h2 className="text-[24px] sm:text-[30px] md:text-[40px] font-bold">
            {testimonial?.title}
          </h2>
          <p className="text-white max-w-2xl text-[16px] sm:text-[18px]">
            {testimonial?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-[#3B7FFF]/10 to-[#2CAA78]/10 border border-[#2D3845] rounded-2xl p-6"
            >
              <div className="mb-3 inline-block bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] bg-clip-text text-transparent">
                ★★★★★
              </div>

              <p className="text-md text-[#FFFFFFB2] mb-6 max-w-xs">
                {item?.text}
              </p>

              <div className="flex items-center gap-3">
                <UserIcon className="w-9 h-9 text-white ring-2 ring-[#4a4a4d] rounded-lg p-1" />
                <span className="text-sm">{item?.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
