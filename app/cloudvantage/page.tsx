"use client";

import CloudVantage from "../../assets/cloudvantage/baseImage.png";
import ImageOne from "../../assets/cloudvantage/imageOne.png";
import ImageTwo from "../../assets/cloudvantage/imageTwo.png";
import ImageThree from "../../assets/cloudvantage/imageThree.png";
import ImageFour from "../../assets/cloudvantage/imageFour.png";
import ImageFive from "../../assets/cloudvantage/imageFive.png";
import ImageSix from "../../assets/cloudvantage/imageSix.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const CloudvantageDetails = () => {
  return (
    <ProjectDetails
      companyName="Cloudvantage"
      about="At Cloudvantage, our vision is to be the foremost provider of affordable cutting-edge cloud solutions that transform the way businesses and individuals connect, collaborate, and innovate."
      technologies="React.js"
      contributions={[
        "I Integrated the frontend with backend APIs to handle server purchase, support, creating key-pairs, security groups, and other functionalities.",
        "I Ensured secure and efficient data handling between the front-end and backend services, managing asynchronous operations and error handling.",
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
      projectLink="https://cloud-vantage.vercel.app/"
      mainImage={{ src: CloudVantage, alt: "mte" }}
    />
  );
};

export default CloudvantageDetails;
