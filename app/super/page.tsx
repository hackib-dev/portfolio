"use client";

import Super from "../../assets/super.png";
import ImageOne from "../../assets/super/imageOne.png";
import ImageTwo from "../../assets/super/imageTwo.png";
import ImageThree from "../../assets/super/imageThree.png";
import ImageFour from "../../assets/super/imageFour.png";
import ImageFive from "../../assets/super/imageFive.png";
import ImageSix from "../../assets/super/imageSix.png";
import ImageSeven from "../../assets/super/imageSeven.png";
import ImageEight from "../../assets/super/imageEight.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const SuperDetails = () => {
  return (
    <ProjectDetails
      companyName="Super International Travels Limited"
      about="Your premium travel companion, offering exceptional flight deals, luxurious accommodations, and unforgettable vacation packages worldwide."
      technologies="TypeScript, Next.js, Shadcn"
      contributions={[
        "I developed a seamless booking interface for flights, hotels, and vacation packages with real-time availability and pricing updates.",
        "I integrated third-party travel APIs to fetch and display flight schedules and package deals",
        "I implemented an intuitive search and filter system allowing users to find the best travel options based on their preferences and budget.",
        "I created a comprehensive booking management dashboard where users can view, modify, and cancel their reservations.",
        "I ensured secure payment gateway integration for processing transactions across multiple currencies and payment methods.",
        "I built responsive and visually appealing interfaces that work flawlessly across all devices, providing users with a premium travel booking experience.",
        "I implemented user authentication and profile management features, allowing travelers to save preferences, view booking history, and manage loyalty rewards.",
        "I collaborated with the design team to create an elegant, user-friendly interface that reflects the premium nature of the travel services offered.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFour, alt: "image-four" },
        { src: ImageFive, alt: "image-five" },
        { src: ImageSix, alt: "image-six" },
        { src: ImageSeven, alt: "image-seven" },
        { src: ImageEight, alt: "image-eight" },
      ]}
      projectLink="https://superinttravels.com/"
      mainImage={{ src: Super, alt: "super-international-travels" }}
    />
  );
};

export default SuperDetails;
