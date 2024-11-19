"use client";

import CrmDashboard from "../../assets/crmdasboard.png";
import ImageOne from "../../assets/crm/imageOne.png";
import ImageTwo from "../../assets/crm/imageTwo.png";
import ImageThree from "../../assets/crm/imageThree.png";
import ImageFour from "../../assets/crm/imageFour.png";
import ImageFive from "../../assets/crm/imageFive.png";
import ImageSix from "../../assets/crm/imageSix.png";
import ImageSeven from "../../assets/crm/testCase.png";
import ImageEight from "../../assets/crm/git.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const CrmDashboardDetails = () => {
  return (
    <ProjectDetails
      companyName="CRM Dashboard"
      about="This is a dummy dashboard project which uses Jest as its testing framework. Login Details (username: emilys; password emilyspass)"
      technologies="TypeScript, Next.js"
      contributions={[
        "I Integrated the frontend with backend APIs to handle login, fetching user details and other functionalities.",
        "I ensured refresh token gotten from the jwt is integrated into the platform so as to refresh the expired token, get a new token and keep users in sesssion while active on the page.",
        "I handled state management across the platform using Redux",
        "I integrated unit-tests using jest to ensure correctness of all functionalities.",
        "I Ensured secure and efficient data handling between the front-end and backend services, managing asynchronous operations and error handling.",
        "I translated wireframes, mockups, and prototypes into responsive, pixel-perfect, and user-friendly interfaces.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageSeven, alt: "image-seven" },
        { src: ImageEight, alt: "image-eight" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFour, alt: "image-four" },
        { src: ImageFive, alt: "image-five" },
        { src: ImageSix, alt: "image-six" },
      ]}
      projectLink="https://crm-dashboard-gray.vercel.app"
      mainImage={{ src: CrmDashboard, alt: "mte" }}
    />
  );
};

export default CrmDashboardDetails;
