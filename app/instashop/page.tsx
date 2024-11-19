"use client";

import Instashop from "../../assets/instashop/imageOne.png";
import ImageOne from "../../assets/instashop/imageOne.png";
import ImageTwo from "../../assets/instashop/imageTwo.png";
import ImageThree from "../../assets/instashop/imageThree.png";
import ImageFour from "../../assets/instashop/imageFour.png";
import ImageFive from "../../assets/instashop/imageFive.png";
import ImageSix from "../../assets/instashop/imageSix.png";

import ProjectDetails from "@/components/ProjectDetails/page";

const InstashopDetails = () => {
  return (
    <ProjectDetails
      companyName="Instashop"
      about="This is a dummy mobile PWA project."
      technologies="TypeScript, Next.js"
      contributions={[
        "I used session state to store the data accross the platform",
        "I handled state management across the platform using Redux",
        "I translated wireframes, mockups, and prototypes into responsive, pixel-perfect, and user-friendly interfaces.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFour, alt: "image-four" },
        { src: ImageFive, alt: "image-five" },
        { src: ImageSix, alt: "image-six" },
      ]}
      projectLink="https://crm-dashboard-gray.vercel.app"
      mainImage={{ src: Instashop, alt: "mte" }}
    />
  );
};

export default InstashopDetails;
