"use client";

import Bitooqoh from "../../assets/bitooqoh.png";
import ImageOne from "../../assets/bitooqoh/imageOne.png";
import ImageTwo from "../../assets/bitooqoh/imageTwo.png";
import ImageThree from "../../assets/bitooqoh/imageThree.png";
import ImageFour from "../../assets/bitooqoh/imageFour.png";
import ImageFive from "../../assets/bitooqoh/imageFive.png";
import ImageSix from "../../assets/bitooqoh/imageSix.jpeg";
import ProjectDetails from "@/components/ProjectDetails/page";

const BitooqohDetails = () => {
  return (
    <ProjectDetails
      companyName="Bitooqoh"
      about="At bitooqoh, we’re passionate about transforming how you experience live events. Founded with a vision to simplify the ticketing process and enhance your event experiences, we’re committed to providing you with an unparalleled platform for discovering, booking, and managing tickets"
      technologies="TypeScript, Next.js, Shadcn"
      contributions={[
        "I Ensured a consistent look and feel across the platform, adhering to the design guidelines and brand identity.",
        "I Integrated the frontend with backend APIs to handle ticket bookings, user authentication,payment processing, and other functionalities.",
        "I handled state management across the platform using Redux",
        "I Created an intuitive and interactive dashboard that allows users to track their sales, view analytics, and manage their ticketing activities.",
        "I Ensured secure and efficient data handling between the front-end and backend services, managing asynchronous operations and error handling.",
        "I Ensured the platform is fully responsive and functions seamlessly across a variety of devices, including desktops, tablets, and mobile phones.",
        "I Implemented mobile-first design principles and test across multiple screen sizes and orientations.",
        "I Collaborated with designers to translate wireframes, mockups, and prototypes into responsive, pixel-perfect, and user-friendly interfaces.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFour, alt: "image-four" },
        { src: ImageFive, alt: "image-five" },
        { src: ImageSix, alt: "image-six" },
      ]}
      projectLink="https://bitooqoh.com"
      mainImage={{ src: Bitooqoh, alt: "mte" }}
    />
  );
};

export default BitooqohDetails;
