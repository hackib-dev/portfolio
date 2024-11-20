"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header/page";
import ZoomableImage from "@/components/ZoomableImage/page";

interface ProjectDetailsProps {
  companyName: string;
  about: string;
  technologies: string;
  contributions: string[];
  galleryImages: { src: string | StaticImageData; alt: string }[];
  projectLink: string;
  mainImage: { src: string | StaticImageData; alt: string };
}

const DetailRow: React.FC<{ label: string; content: React.ReactNode }> = ({
  label,
  content,
}) => (
  <div className="grid grid-cols-1 gap-2 md:grid-cols-7 font-medium">
    <p className="col-span-2 text-lg">{label}</p>
    <div className="col-span-5 text-lg text-[#77768C]">{content}</div>
  </div>
);

const ProjectDetails = ({
  companyName,
  about,
  technologies,
  contributions,
  galleryImages,
  projectLink,
  mainImage,
}: ProjectDetailsProps) => {
  return (
    <div className="mb-10">
      <Header backgroundImage={false} />
      <div className="flex gap-3 items-center justify-center w-full px-auto">
        <div className="h-2 w-2 xl:h-5 xl:w-5 bg-white rounded-full"></div>
        <Link href={projectLink}>
          <p className="text-lg md:text-3xl font-semibold text-white">
            {companyName}
          </p>
        </Link>
        <div className="h-2 w-2 xl:h-5 xl:w-5 bg-white rounded-full"></div>
      </div>
      <div className="relative w-full px-5 xl:px-40 mt-5">
        <Image src={mainImage.src} alt={mainImage.alt} className="w-full" />
        <div className="absolute inset-0 bottom-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
          <div className="flex gap-3">
            <Link href={projectLink}>
              <Button
                size="lg"
                className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white h-9 px-3 md:h-11 md:px-8"
              >
                Visit Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-white px-5 xl:px-40 mt-10 flex flex-col gap-5">
        <DetailRow label="Company" content={companyName} />
        <DetailRow label="About" content={about} />
        <DetailRow label="Technologies" content={technologies} />
        <DetailRow
          label="My Contributions"
          content={
            <ul className="md:list-disc space-y-2">
              {contributions.map((contribution, index) => (
                <li key={index}>{contribution}</li>
              ))}
            </ul>
          }
        />
        <DetailRow
          label="Gallery"
          content={
            <div className="grid grid-cols-2 col-span-5 gap-5">
              {galleryImages.map((image, index) => (
                <ZoomableImage key={index} src={image.src} alt={image.alt} />
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
