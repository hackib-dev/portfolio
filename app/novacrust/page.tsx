"use client";

import Nova from "../../assets/nova/imageOne.png";
import ImageOne from "../../assets/nova/imageOne.png";
import ImageTwo from "../../assets/nova/imageTwo.png";
import ImageThree from "../../assets/nova/imageThree.png";
import ProjectDetails from "@/components/ProjectDetails/page";

const NovacrustDetails = () => {
  return (
    <ProjectDetails
      companyName="Novacrust Labs - Crypto Checkout Widget"
      about="A modern, production-ready crypto-to-cash conversion widget built for Novacrust Labs. This embeddable checkout experience (similar to Stripe Checkout) demonstrates advanced form handling, state management, and a seamless crypto payment flow."
      technologies="TypeScript, Next.js 15, Shadcn, Redux Toolkit, React Query, React Hook Form, Zod"
      contributions={[
        "I architected a production-ready embeddable crypto checkout widget with multi-currency support (ETH, BTC, USDT) and wallet provider integration (Metamask, Rainbow, WalletConnect).",
        "I implemented advanced state management using Redux Toolkit for global client state and TanStack Query (React Query) for efficient server state management and data fetching.",
        "I developed a robust form handling system using React Hook Form with Zod schema validation, ensuring type-safe validation and optimal performance with uncontrolled components.",
        "I built a comprehensive reusable component library using shadcn/ui and Radix UI, providing accessible, customizable components with full code ownership.",
        "I created smooth user flows from currency selection through wallet connection to payment confirmation, with real-time form validation and error handling.",
        "I implemented loading states with skeleton loaders, error boundaries, and comprehensive error handling for production-grade reliability.",
        "I ensured full accessibility compliance with ARIA attributes, keyboard navigation, and screen reader support throughout the application.",
        "I integrated copy-to-clipboard functionality, smooth animations, and transitions for enhanced user experience on the success page.",
      ]}
      galleryImages={[
        { src: ImageOne, alt: "image-one" },
        { src: ImageTwo, alt: "image-two" },
        { src: ImageThree, alt: "image-three" },
      ]}
      projectLink="https://novacrust-assessment-lovat.vercel.app"
      mainImage={{ src: Nova, alt: "novacrust-assessment" }}
    />
  );
};

export default NovacrustDetails;
