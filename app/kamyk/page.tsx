"use client";

import Kamyk from "../../assets/kamyk.png";
import ImageOne from "../../assets/kamyk/imageOne.png";
import ImageTwo from "../../assets/kamyk/imageTwo.png";
import ImageThree from "../../assets/kamyk/imageThree.png";
import ImageFour from "../../assets/kamyk/imageFour.png";
import ImageFive from "../../assets/kamyk/imageFive.png";
import ImageSix from "../../assets/kamyk/imageSix.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const KamykDetails = () => {
  return (
    <ProjectDetails
      companyName="Kamyk Hospital"
      about="At Kamyk, we are committed to providing exceptional healthcare services to our community. Our mission is to deliver high-quality, compassionate care to every patient, every day. Founded in 2019, Kamyk has been a cornerstone of the Ojodu community. From our humble beginnings as a small clinic, we have grown into a leading healthcare provider with a reputation for excellence. We believe in giving back to the community that supports us. Kamyk Hospital is actively involved in various community health initiatives, educational programs, and partnerships with local organizations to promote wellness and health education."
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
      projectLink="https://kamyk.vercel.app"
      mainImage={{ src: Kamyk, alt: "kamyk" }}
    />
  );
};

export default KamykDetails;
