"use client";

import Mte from "../../assets/mte.png";
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
      companyName="Muslim Tech Expo — Nigeria"
      about="The Muslim Tech Expo is a flagship annual event for Muslim tech aspirants, professionals, and entrepreneurs to learn, interact, and explore opportunities in the ever-evolving world of tech. Now in its 4th edition, MTE Nigeria has grown into a multi-day hybrid conference with speakers, workshops, ticketing, and merch — all built and maintained as the event scales year over year."
      technologies="TypeScript, Next.js, Shadcn, AOS"
      metrics={[
        { value: "4 editions", label: "shipped and maintained since MTE 1.0" },
        { value: "Multi-day", label: "hybrid conference: talks, workshops & networking" },
        { value: "100%", label: "responsive across devices for on-the-go attendees" },
      ]}
      contributions={[
        "Implemented mobile-first design principles and tested across multiple screen sizes and orientations.",
        "Ensured the platform is fully responsive and functions seamlessly across various devices.",
        "Collaborated with designers to translate wireframes, mockups, and prototypes into responsive, pixel-perfect, and user-friendly interfaces.",
        "Ensured a consistent look and feel across the platform, adhering to the design guidelines and brand identity.",
        "Rebuilt and evolved the site across multiple editions (1.0 through 4.0) as the event's branding and scope grew.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFour, alt: "image-four" },
        { src: ImageFive, alt: "image-five" },
        { src: ImageSix, alt: "image-six" },
      ]}
      projectLink="https://www.muslimtechexpo.com"
      mainImage={{ src: Mte, alt: "muslim-tech-expo-nigeria" }}
    />
  );
};

export default MteDetails;
