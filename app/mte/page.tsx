"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Mte from "../../assets/mte.png";
import Link from "next/link";
import Header from "@/components/Header/page";
import ZoomableImage from "@/components/ZoomableImage/page";
import ImageOne from "../../assets/mte/imageOne.png";
import ImageTwo from "../../assets/mte/imageTwo.png";
import ImageThree from "../../assets/mte/imageThree.png";
import ImageFour from "../../assets/mte/imageFour.png";
import ImageFive from "../../assets/mte/imageFive.png";
import ImageSix from "../../assets/mte/imageSix.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const MteDetails = () => {
  return (
    <ProjectDetails
      companyName="Muslim Tech Expo"
      about="The Muslim Tech Expo is an incredible event for Muslim tech aspirants, professionals, and entrepreneurs to learn, interact, and explore opportunities in the ever-evolving world of tech."
      technologies="TypeScript, Next.js, Shadcn, AOS"
      contributions={[
        "Implemented mobile-first design principles and tested across multiple screen sizes and orientations.",
        "Ensured the platform is fully responsive and functions seamlessly across various devices.",
        "Collaborated with designers to translate wireframes, mockups, and prototypes into responsive, pixel-perfect, and user-friendly interfaces.",
        "Ensured a consistent look and feel across the platform, adhering to the design guidelines and brand identity.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFour, alt: "image-four" },
        { src: ImageFive, alt: "image-five" },
        { src: ImageSix, alt: "image-six" },
      ]}
      projectLink="https://mte-psi.vercel.app"
      mainImage={{ src: Mte, alt: "mte" }}
    />
  );
};

export default MteDetails;
