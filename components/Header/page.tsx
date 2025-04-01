"use client";

import Image, { StaticImageData } from "next/image";
import Logo from "../../assets/logoAqib.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BackgroundLines } from "../BackgroundLines/page";

interface HeaderProps {
  backgroundImage: boolean;
}

const Header = ({ backgroundImage }: HeaderProps) => {
  const bgImage = {
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "cover",
  };
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggleMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const router = useRouter();
  const pathname = usePathname();
  const [isDefaultPage, setIsDefaultPage] = useState(true);
  const [sectionToScroll, setSectionToScroll] = useState<string | null>(null);

  useEffect(() => {
    setIsDefaultPage(pathname === "/");

    // If there's a section to scroll to, scroll after the route changes
    if (pathname === "/" && sectionToScroll) {
      scrollToSection(sectionToScroll);
      setSectionToScroll(null); // Reset after scrolling
    }
  }, [pathname, sectionToScroll]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (sectionId: string) => {
    if (isDefaultPage) {
      scrollToSection(sectionId);
    } else {
      setSectionToScroll(sectionId);
      router.push("/");
    }
  };

  return (
    <div
      className={`${
        backgroundImage
          ? 'relative h-[500px] md:h-[600px] bg-[url("../assets/aqib.jpg")]'
          : ""
      }`}
      style={backgroundImage ? bgImage : {}}
    >
      <div className="py-1 md:py-5 ">
        <div className="bg-white mx-auto md:w-4/5 xl:w-1/2 px-2  rounded-[99px] md:flex justify-between items-center py-1 hidden mb-20">
          <div className="flex">
            <Link href={"/"}>
              <Image src={Logo} alt="logo" className="w-10"></Image>
            </Link>
          </div>

          <div className="flex  px-10 ">
            <p
              className="font-medium hover:text-[17px] cursor-pointer"
              onClick={() => handleNavigation("about")}
            >
              About
            </p>
            <p
              className="pl-4 font-medium hover:text-[17px] cursor-pointer"
              onClick={() => handleNavigation("projects")}
            >
              Projects
            </p>
            <Link
              href={
                "https://drive.google.com/file/d/1WAEZlxsP0FyGIdWom7Tp3snaN7VGDT0p/view?usp=drivesdk"
              }
              target="_blank"
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
            className={`flex flex-col fixed w-screen right-0 top-0 md:hidden py-10 bg-[#232230] text-white px-6 z-50 h-screen text-center transition-all duration-1000 ease-in-out ${
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
                  handleNavigation("about");
                }}
              >
                <p>About</p>
              </div>

              <div
                onClick={() => {
                  toggleMenu();
                  handleNavigation("projects");
                }}
              >
                <p>Projects</p>
              </div>

              <Link
                href={
                  "https://drive.google.com/file/d/1WAEZlxsP0FyGIdWom7Tp3snaN7VGDT0p/view?usp=drivesdk"
                }
                target="_blank"
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
      </div>
    </div>
  );
};

export default Header;
