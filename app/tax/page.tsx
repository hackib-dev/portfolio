"use client";

import Tax from "../../assets/tax.png";
import ImageOne from "../../assets/tax/imageOne.png";
import ImageTwo from "../../assets/tax/imageTwo.png";
import ImageThree from "../../assets/tax/imageThree.png";
import ImageFour from "../../assets/tax/imageFour.png";
import ImageFive from "../../assets/tax/imageFive.png";
import ImageSix from "../../assets/tax/imageSix.png";
import ImageSeven from "../../assets/tax/imageSeven.png";
import ImageEight from "../../assets/tax/imageEight.png";
import ImageNine from "../../assets/tax/imageNine.png";
import ImageTen from "../../assets/tax/imageTen.png";
import ImageEleven from "../../assets/tax/imageEleven.png";
import ImageTwelve from "../../assets/tax/imageTwelve.png";
import ImageThirteen from "../../assets/tax/imageThirteen.png";
import ImageFourteen from "../../assets/tax/imageFourteen.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const TaxDetails = () => {
  return (
    <ProjectDetails
      companyName="FIRS Tax Management System"
      about="An internal role-based tax administration platform developed for the Federal Inland Revenue Service (FIRS) to monitor, track, and manage tax remittances across Nigeria. The system enables Federal users, State officers, Regional coordinators, and Tax officers to efficiently oversee citizen tax compliance and revenue collection."
      technologies="TypeScript, Next.js, Apache echart, Shadcn"
      contributions={[
        "I developed a comprehensive role-based access control (RBAC) system supporting multiple user hierarchies including Federal users, State officers, Regional coordinators, Coordinating unit officers, and Tax officers with granular permissions.",
        "I built an advanced dashboard with real-time analytics showing tax remittance data, collection trends, and compliance metrics across Federal, State, and Regional levels.",
        "I implemented a geographic visualization system with interactive Nigeria map displaying tax collection statistics by state, region, and local government areas.",
        "I created a citizen tax profile management interface allowing officers to track individual and corporate taxpayer records, payment history, and compliance status.",
        "I developed a multi-level reporting system enabling users to generate customized reports based on their role, region, and access level with export functionality.",
        "I integrated state management using Redux to handle complex data flows across different user roles and hierarchical levels efficiently.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
        { src: ImageFourteen, alt: "image-fourteen" },
        { src: ImageFour, alt: "image-four" },
        { src: ImageFive, alt: "image-five" },
        { src: ImageSix, alt: "image-six" },
        { src: ImageSeven, alt: "image-seven" },
        { src: ImageEight, alt: "image-eight" },
        { src: ImageNine, alt: "image-nine" },
        { src: ImageTen, alt: "image-ten" },
        { src: ImageEleven, alt: "image-eleven" },
        { src: ImageTwelve, alt: "image-twelve" },
        { src: ImageThirteen, alt: "image-thirteen" },
      ]}
      projectLink="https://tax-manager-mu.vercel.app"
      mainImage={{ src: Tax, alt: "firs-tax-management-system" }}
    />
  );
};

export default TaxDetails;
