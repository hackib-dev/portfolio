"use client";

import MteKenya from "../../assets/mteKenya.png";
import ImageOne from "../../assets/mte-kenya/imageOne.png";
import ImageTwo from "../../assets/mte-kenya/imageTwo.png";
import ImageThree from "../../assets/mte-kenya/imageThree.png";
import ImageFour from "../../assets/mte-kenya/imageFour.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const MteKenyaDetails = () => {
  return (
    <ProjectDetails
      companyName="Muslim Tech Expo — Kenya"
      about="MTE Kenya, 'Adapt. Build. Lead.', is the Muslim Tech Expo's expansion into East Africa. Rather than reusing the Nigeria site, this is a separate, dedicated build with its own branding, hero, speaker lineup, and event details for Nairobi, distinct from the flagship Nigeria edition."
      technologies="TypeScript, Next.js, Shadcn, AOS"
      metrics={[
        { value: "1st edition", label: "East Africa's inaugural MTE event" },
        { value: "Separate build", label: "own branding, hero, and content from MTE Nigeria" },
        { value: "Nairobi", label: "hosted at KICC (Kenyatta International Conventional Centre)" },
      ]}
      contributions={[
        "Built a standalone site for MTE Kenya with its own branding and identity, distinct from the Nigeria edition.",
        "Implemented mobile-first design principles and tested across multiple screen sizes and orientations.",
        "Ensured the platform is fully responsive and functions seamlessly across various devices.",
        "Collaborated with designers to translate wireframes, mockups, and prototypes into a responsive, pixel-perfect interface tailored to the Kenya market.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFour, alt: "image-four" },
      ]}
      projectLink="https://kenya.muslimtechexpo.com"
      mainImage={{ src: MteKenya, alt: "muslim-tech-expo-kenya" }}
    />
  );
};

export default MteKenyaDetails;
