"use client";

import Image from "next/image";
import AboutLine from "../../assets/aboutLine.png";

const HeroSection = () => {
  return (
    <div>
      <div className="hidden md:block text-white text-6xl  xl:text-[83px] absolute top-[250px] left-1/2 transform -translate-x-1/2 -translate-y-1/2  uppercase font-medium leading-none text-center mt-10 md:mt-20 xl:mt-[100px]">
        <div className="h-20 md:h-24 border-dashed border-custom-purple   border-l-2 border-r-2 ">
          <p>Frontend</p>
        </div>
        <div className="h-20 md:h-24 border-dashed border-custom-purple   px-4 border-l-2 border-r-2 border-t-2 ">
          <p>Developer</p>
        </div>
        <div className="h-20 md:h-24  border-dashed border-custom-purple   border-l-2 border-r-2 border-b-2 ">
          <p>Since</p>
        </div>
        <div className="h-20 md:h-24  border-dashed border-custom-purple border-l-2 border-r-2">
          <p className="text-[#FF512F]">2021</p>
        </div>
      </div>

      <div className="block md:hidden text-white text-6xl  xl:text-[83px] absolute top-[250px] left-1/2 transform -translate-x-1/2 -translate-y-1/2  uppercase font-medium leading-none text-center mt-8 md:mt-20 xl:mt-[100px] space-y-5">
        <p>Frontend</p>
        <p>Developer</p>
        <p>Since</p>
        <p className="text-[#FF512F]">2021</p>
      </div>
    </div>
  );
};

export default HeroSection;

{
  /* <div className="">
        <Image src={AboutLine} alt="line" className="hidden xl:flex pt-8" />
      </div> */
}
