"use client";

import Image from "next/image";
import AboutLine from "../assets/aboutLine.png";
import Logo from "../assets/logoAqib.png";
import { Button } from "@/components/ui/button";
import Profile from "../assets/profile.png";
import Nigeria from "../assets/nigeria.png";
import Engineer from "../assets/engineer.png";
import Location from "../assets/map.png";
import Map from "../assets/travel.png";
import Available from "../assets/available.png";
import Google from "../assets/google.png";
import Udemy from "../assets/udemy.png";
import SideHustle from "../assets/SideHustle.png";
import Coursera from "../assets/coursera.png";
import Jobberman from "../assets/Jobberman.png";
import Mte from "../assets/mte.png";
import Bitooqoh from "../assets/bitooqoh.png";
import Mss from "../assets/mss.png";
import Acemyx from "../assets/acemyx.png";
import Payv from "../assets/pvg.png";
import Link from "next/link";
import Framework from "@/components/FrameworkCard/page";
import NextJs from "../assets/next.png";
import ReactIcon from "../assets/React-icon.png";
import Shadcn from "../assets/shadcn.png";
import Sql from "../assets/sql.png";
import Tools from "../assets/tools.png";
import { MenuIcon, Phone, X } from "lucide-react";
import Mail from "../assets/mail.png";
import Linkedin from "../assets/Linkdin.png";
import { useState } from "react";
import Kenntechs from "../assets/kenntechs.png";
import Typescript from "../assets/Typescript.png";

const App = () => {
  const bgImage = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "cover",
  };
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggleMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div
      className="relative h-screen  bg-[url('../assets/aqib.jpg')]"
      style={bgImage}
    >
      <div className="py-1 md:py-5 mb-20">
        <div className="bg-white mx-auto md:w-4/5 xl:w-1/2 px-2  rounded-[99px] md:flex justify-between items-center py-1 hidden mb-20">
          <div className="flex">
            <Link href={"/"}>
              <Image src={Logo} alt="logo" className="w-10"></Image>
            </Link>
          </div>

          <div className="flex  px-10 ">
            <p
              className="font-medium hover:text-[17px] cursor-pointer"
              onClick={() => scrollToSection("about")}
            >
              About
            </p>
            <p
              className="pl-4 font-medium hover:text-[17px] cursor-pointer"
              onClick={() => scrollToSection("projects")}
            >
              Projects
            </p>
            <Link
              href={
                "https://drive.google.com/file/d/1DDgkLrRvdFnqIxXLy6RqHf480_dRHfZJ/view?usp=sharing"
              }
            >
              <p className="px-4 font-medium hover:text-[17px]">Resume</p>
            </Link>
            <p
              className="pl-4 font-medium hover:text-[17px] cursor-pointer"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </p>
          </div>
          <div className="my-1">
            <Link href={"https://www.linkedin.com/in/aqib-akinyele"}>
              <Button className="bg-[#373646] text-white rounded-[25px] text-sm font-bold">
                Linkedin
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex md:hidden p-4 items-center justify-between">
          <Link href={"/"}>
            <Image src={Logo} alt="logo" className="w-10"></Image>
          </Link>
          <div className="flex md:hidden text-white">
            <MenuIcon onClick={toggleMenu} aria-label="Toggle menu" />
          </div>
        </div>

        {isOpenMenu && (
          <div
            className={`flex flex-col absolute w-screen right-0 -top-3 md:hidden py-10 bg-[#232230] text-white px-6 z-50 h-screen text-center transition-all duration-1000 ease-in-out ${
              isOpenMenu ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="flex justify-between items-center">
              <Link href={`/`}>
                <Image src={Logo} alt="logo" width={40} loading="lazy" />
              </Link>
              <X className="w-6 h-6" onClick={toggleMenu} />
            </div>

            <div className="flex flex-col gap-10 mt-32 text-xl font-medium">
              <div
                onClick={() => {
                  toggleMenu();
                  scrollToSection("about");
                }}
              >
                <p>About</p>
              </div>

              <div
                onClick={() => {
                  toggleMenu();
                  scrollToSection("projects");
                }}
              >
                <p>Projects</p>
              </div>

              <Link
                href={
                  "https://drive.google.com/file/d/1DDgkLrRvdFnqIxXLy6RqHf480_dRHfZJ/view?usp=sharing"
                }
              >
                <p>Resume</p>
              </Link>

              <div
                onClick={() => {
                  toggleMenu();
                  scrollToSection("contact");
                }}
              >
                <p>Contact</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-white text-6xl  xl:text-[83px] absolute top-[250px] left-1/2 transform -translate-x-1/2 -translate-y-1/2  uppercase font-medium leading-none text-center mt-0 md:mt-5 xl:mt-[100px]">
          <p>Frontend</p>
          <p>Developer</p>
          <p>Since</p>
          <p className="text-[#FF512F]">2021</p>
        </div>

        <div className="px-[200px]">
          <Image src={AboutLine} alt="line" className="hidden xl:flex pt-8" />
        </div>
      </div>
      <div
        className="flex flex-col items-center justify-center  px-5 md:px-10 xl:px-44 mx-auto text-center gap-y-2 md:gap-y-10"
        id="about"
      >
        <div className="flex bg-[#232230] rounded-xl items-center justify-between mx-0 md:mx-5 xl:mx-20 mt-72 md:mt-52 xl:mt-10 md:p-5">
          <div className="flex gap-x-3 md:gap-x-5 px-3 md:px-10 items-center">
            <div>
              <Image
                src={Profile}
                alt="Aqib profile"
                className="w-8 md:w-16"
              ></Image>
            </div>
            <div className="flex flex-col md:justify-evenly py-3 md:py-">
              <div className="flex items-center gap-2 text-white text-sm md:text-lg font-medium">
                <p>Aqib Akinyele K.</p>
                <Image src={Nigeria} alt="Nigeria"></Image>
              </div>
              <div className="flex gap-x-2 justify-center md:gap-x-3 xl:gap-x-5">
                <div className="flex  items-center gap-1 md:gap-2 text-white">
                  <Image src={Engineer} alt="engineer"></Image>
                  <p className="text-[9px] md:text-sm ">Frontend Developer</p>
                </div>
                <div className="flex items-center gap-1 md:gap-2 text-white">
                  <Image src={Location} alt="location"></Image>
                  <p className="text-[9px] md:text-sm ">Everywhere</p>
                </div>
                <div className="flex items-center gap-1  md:gap-2 text-[#008753]">
                  <Image src={Available} alt="available" width={12}></Image>
                  <p className="text-[9px] md:text-sm ">Available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <Image src={Map} alt="travel" className="float-right"></Image>
          </div>
        </div>
        <div>
          <p className="text-[#B0B0B0] px-1 md:px-20 xl:px-40 md:text-xl mt-5 md:mt-0">
            Frontend Developer with several years of experience. Multiple
            certifications. Passionate about sports and naturally curious.
            Currently, I am focused on becoming a great leader and continuing to
            share. I feel optimistic about the impact my skills can have in the
            real world and believe that I can create innovative solutions to
            human pain-points which will ultimately lead to a better user
            experience.
          </p>
        </div>

        <div className="mt-10 items-center flex flex-col justify-center mx-auto">
          <p className="text-white px-5 md:px-40 uppercase text-center font-bold text-2xl md:text-4xl mb-8">
            certifications
          </p>
          <div className="hidden md:flex justify-between items-center gap-x-16 justify-items-center text-center content-center">
            <Image src={Coursera} alt="coursera" width={100}></Image>
            <Image src={Udemy} alt="udemy" width={80}></Image>
            <Image src={Google} alt="google" width={25}></Image>
            <Image src={SideHustle} alt="sidehustle" width={100}></Image>
            <Image src={Jobberman} alt="jobberman" width={100}></Image>
          </div>
          <div className="grid grid-cols-3 md:hidden justify-between place-items-center gap-x-8  gap-y-8 text-center">
            <Image src={Coursera} alt="coursera" width={100}></Image>
            <Image src={Udemy} alt="udemy" width={80}></Image>
            <Image src={Google} alt="google" width={25}></Image>
            <Image src={SideHustle} alt="sidehustle" width={100}></Image>
            <Image src={Jobberman} alt="jobberman" width={100}></Image>
          </div>
          <div className="mt-10 flex gap-x-2 md:gap-x-4">
            <Link
              href={
                "https://www.linkedin.com/in/aqib-akinyele/details/certifications"
              }
            >
              <Button
                size={"lg"}
                className="bg-white text-[#121120] hover:bg-white hover:text-[#121120]"
              >
                View on Linkedin
              </Button>
            </Link>

            <Link href={"https://github.com/hackib-dev"}>
              <Button
                size={"lg"}
                variant={"outline"}
                className="text-white bg-[#121120]"
              >
                Github
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="mt-10 items-center flex flex-col justify-center mx-auto px-5 md:px-10 xl:px-40 py-10"
        id="projects"
      >
        <p className="text-white px-28 uppercase text-center font-bold text-2xl md:text-4xl mb-1">
          projects
        </p>
        <p className="text-[#B0B0B0] px-5 md:px-40 text-lg text-center font-medium mb-8">
          Top Six(6) Selected Projects.
        </p>
        <div className="grid grid-cols-2 justify-between items-center gap-x-5 md:gap-x-16 justify-items-center text-center content-center gap-y-10">
          <div className="relative col-span-2 w-full">
            <Image src={Mte} alt="mte" className="w-full"></Image>
            <div className="absolute inset-0 bottom-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
              <Link
                href={"https://mte-psi.vercel.app"}
                className="text-white text-xl font-medium"
              >
                <Button
                  size={"lg"}
                  className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white h-9 px-3 md:h-11 md:px-8"
                >
                  Visit Project
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Image src={Bitooqoh} alt="bitooqoh" className="w-full"></Image>
            <div className="absolute inset-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
              <Link
                href={"https://bitooqoh.com"}
                className="text-white text-xl font-medium underline"
              >
                <Button className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white h-9 px-3 md:h-11 md:px-8">
                  Visit Project
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image src={Acemyx} alt="acemyx" className="w-full"></Image>
            <div className="absolute inset-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
              <Link
                href={"https://acemyx.com"}
                className="text-white text-xl font-medium underline"
              >
                <Button className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white h-9 px-3 md:h-11 md:px-8">
                  Visit Project
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image src={Mss} alt="mss" className="w-full"></Image>
            <div className="absolute inset-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
              <Link
                href={"https://mssn.vercel.app"}
                className="text-white text-xl font-medium underline"
              >
                <Button className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white h-9 px-3 md:h-11 md:px-8">
                  Visit Project
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image src={Payv} alt="payvantage" className="w-full"></Image>
            <div className="absolute inset-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
              <Link
                href={"https://www.payvantage.com.ng"}
                className="text-white text-xl font-medium underline"
              >
                <Button className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white h-9 px-3 md:h-11 md:px-8">
                  Visit Project
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative col-span-2 w-full">
            <Image src={Kenntechs} alt="kenntechs" className="w-full"></Image>
            <div className="absolute inset-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
              <Link
                href={"https://kenntechs.vercel.app/"}
                className="text-white text-xl font-medium underline"
              >
                <Button
                  size={"lg"}
                  className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white"
                >
                  Visit Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 items-center flex flex-col justify-center mx-auto px-5 md:px-10 xl:px-40 py-10">
          <p className="text-white px-5 md:px-5 xl:px-32 uppercase text-center font-bold text-2xl md:text-4xl mb-1">
            Frameworks & Tech
          </p>
          <p className="text-[#B0B0B0] px-2 text-center font-medium mb-2">
            These are the tools and frameworks with which I feel more
            comfortable without limiting myself to them because I have worked
            with Python, Mysql, CodeIgniter and others...
          </p>
          <p className="text-[#B0B0B0] text-lg text-center font-medium mb-8">
            My main stack is:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Framework
            body={"App dir, Routing, Layouts, Loading UI and API routes."}
            title={"Next.js"}
            framworkImage={NextJs}
          />

          <Framework
            body={"Server and Client Components. Use hook."}
            title={"React.js"}
            framworkImage={ReactIcon}
          />

          <div className="col-span-1 md:col-span-2 md:w-1/2 mx-auto">
            <Framework
              body={
                "Using TypeScript with Next.js improves type safety, development efficiency, and scalability."
              }
              title={"TypeScript"}
              framworkImage={Typescript}
            />
          </div>

          <Framework
            body={"UI components styled with Tailwind CSS."}
            title={"Shadcn"}
            framworkImage={Shadcn}
          />

          <Framework
            body={"SQLyog used for querying database."}
            title={"Database"}
            framworkImage={Sql}
          />
        </div>
      </div>
      <Image
        src={Tools}
        alt="tools"
        className="mx-auto w-full md:w-[600px]"
      ></Image>
      <p className="text-white px-5 md:px-32 uppercase text-center font-medium text-xl mb-5">
        Contact
      </p>
      <div
        className="px-5 flex gap-10 mt-3 md:mt-0 items-center justify-center pb-10 text-[#B0B0B0]"
        id="contact"
      >
        <Link
          href={"mailto:aqibkenn@gmail.com"}
          className="flex gap-2 items-center"
        >
          <Image src={Mail} alt="" className="w-9 h-9" />
          <p>Mail</p>
        </Link>

        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={"https://www.linkedin.com/in/aqib-akinyele"}
          className="flex gap-2 items-center"
        >
          <Image src={Linkedin} alt="" className="w-9 h-9" />
          <p>Linkedin</p>
        </Link>

        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={"https://api.whatsapp.com/send/?phone=2348118888108"}
          className="flex gap-2 items-center"
        >
          <Phone className="w-5 h-5" color="white" />
          <p>Whatsapp</p>
        </Link>
      </div>
    </div>
  );
};

export default App;
