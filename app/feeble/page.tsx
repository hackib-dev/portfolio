"use client";

import Feeble from "../../assets/feeble/imageOne.png";
import ImageOne from "../../assets/feeble/imageOne.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const FeebleDetails = () => {
  return (
    <ProjectDetails
      companyName="Feeble - Frontend Developer Assessment"
      about="A pixel-perfect implementation of a modern hero section featuring smooth animations, responsive design, and clean, maintainable code. Built as a technical assessment showcasing advanced frontend development skills."
      technologies="TypeScript, Next.js 15, Shadcn, Framer Motion, Tailwind CSS"
      contributions={[
        "I implemented a pixel-perfect design with exact spacing, padding, and margins matching Figma specifications across all breakpoints (desktop 64px, tablet 48px, mobile 36px typography).",
        "I developed a comprehensive design token system providing a single source of truth for colors, typography, and spacing, enabling easy theme changes and maintainability.",
        "I utilized Framer Motion to create smooth, performant animations with declarative API for complex animation sequences.",
        "I established a robust code quality workflow with TypeScript strict mode, ESLint, Prettier, and Husky pre-commit hooks ensuring zero console errors or warnings.",
        "I built a reusable component architecture following atomic design principles with component composition for scalability and maintainability.",
        "I implemented mobile-first responsive design with progressive enhancement, ensuring optimal performance across all devices.",
        "I ensured semantic HTML structure with proper accessibility features (ARIA labels, keyboard navigation) for inclusive user experience.",
        "I configured automated pre-commit checks validating TypeScript types, ESLint standards, Prettier formatting, and build verification.",
      ]}
      galleryImages={[{ src: ImageOne, alt: "image-one" }]}
      projectLink="https://feeble-assessment.vercel.app"
      mainImage={{ src: Feeble, alt: "feeble-assessment" }}
      videoUrl="/videos/feeble-video.mp4"
    />
  );
};

export default FeebleDetails;
