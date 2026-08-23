"use client";

const scrollToProjects = () => {
  const section = document.getElementById("projects");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const HeroCTA = () => (
  <div className="flex flex-col items-center gap-2">
    <button
      onClick={scrollToProjects}
      className="group flex items-center gap-2 bg-white text-[#121120] font-semibold rounded-full px-6 py-3 text-sm md:text-base hover:bg-[#FF512F] hover:text-white transition-colors duration-300"
    >
      See what I&apos;ve built
      <span className="transition-transform duration-300 group-hover:translate-y-0.5">
        ↓
      </span>
    </button>
    <p className="text-white/70 text-xs md:text-sm">
      Live apps in fintech, travel & events
    </p>
  </div>
);

const HeroSection = () => {
  return (
    <div>
      <div className="hidden md:flex flex-col items-center gap-8 text-white text-6xl  xl:text-[83px] absolute top-[250px] left-1/2 transform -translate-x-1/2 -translate-y-1/2  uppercase font-medium leading-none text-center mt-10 md:mt-20 xl:mt-[100px]">
        <div>
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
        <div className="normal-case text-base">
          <HeroCTA />
        </div>
      </div>

      <div className="flex md:hidden flex-col items-center gap-6 text-white text-6xl  xl:text-[83px] absolute top-[250px] left-1/2 transform -translate-x-1/2 -translate-y-1/2  uppercase font-medium leading-none text-center mt-8 md:mt-20 xl:mt-[100px]">
        <div className="space-y-5">
          <p>Frontend</p>
          <p>Developer</p>
          <p>Since</p>
          <p className="text-[#FF512F]">2021</p>
        </div>
        <div className="normal-case">
          <HeroCTA />
        </div>
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
