"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header/page";
import ZoomableImage from "@/components/ZoomableImage/page";
import { useRef, useEffect } from "react";

interface ProjectDetailsProps {
  companyName: string;
  about: string;
  technologies: string;
  contributions: string[];
  galleryImages: { src: string | StaticImageData; alt: string }[];
  projectLink: string;
  mainImage?: { src: string | StaticImageData; alt: string };
  videoUrl?: string;
  metrics?: { label: string; value: string }[];
  confidential?: boolean;
  unavailableNote?: string;
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
  videoUrl,
  metrics,
  confidential,
  unavailableNote,
}: ProjectDetailsProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <div className="mb-10">
      <Header backgroundImage={false} />
      <div className="flex gap-3 items-center justify-center w-full px-auto">
        <div className="h-2 w-2 xl:h-5 xl:w-5 bg-white rounded-full"></div>
        {confidential ? (
          <p className="text-lg md:text-3xl font-semibold text-white">
            {companyName}
          </p>
        ) : (
          <Link href={projectLink} target="_blank">
            <p className="text-lg md:text-3xl font-semibold text-white">
              {companyName}
            </p>
          </Link>
        )}
        <div className="h-2 w-2 xl:h-5 xl:w-5 bg-white rounded-full"></div>
      </div>

      {mainImage ? (
        <div className="relative w-full px-5 xl:px-40 mt-5">
          <Image src={mainImage.src} alt={mainImage.alt} className="w-full" />
          {!confidential && (
            <div className="absolute inset-0 bottom-0 bg-[#121120] bg-opacity-70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[3%]">
              <div className="flex gap-3">
                <Link href={projectLink} target="_blank">
                  <Button
                    size="lg"
                    className="bg-white text-[#121120] text-sm md:text-lg hover:bg-white h-9 px-3 md:h-11 md:px-8"
                  >
                    Visit Project
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full px-5 xl:px-40 mt-5">
          <div className="w-full rounded-xl border border-[#32304a] bg-[#1a1928] px-6 py-10 md:py-16 flex flex-col items-center justify-center text-center gap-3">
            <p className="uppercase tracking-widest text-xs md:text-sm text-[#77768C] font-semibold">
              Confidential / In-house Project
            </p>
            <p className="text-[#B0B0B0] max-w-xl text-sm md:text-base">
              This project is an internal company platform. Screenshots
              aren&apos;t publicly shareable, so here&apos;s a written
              breakdown of the work instead.
            </p>
          </div>
        </div>
      )}

      <div className="text-white px-5 xl:px-40 mt-10 flex flex-col gap-5">
        <DetailRow label="Company" content={companyName} />
        <DetailRow label="About" content={about} />
        <DetailRow label="Technologies" content={technologies} />

        {unavailableNote && (
          <DetailRow
            label="Live Access"
            content={
              <div className="rounded-xl border border-[#32304a] bg-[#1a1928] px-4 py-3 text-sm md:text-base text-[#B0B0B0]">
                {unavailableNote}
              </div>
            }
          />
        )}

        {/* Metrics Section - Only show if metrics exist */}
        {metrics && metrics.length > 0 && (
          <DetailRow
            label="Impact"
            content={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[#32304a] bg-[#1a1928] px-4 py-4 text-center"
                  >
                    <p className="text-white text-xl md:text-2xl font-bold">
                      {metric.value}
                    </p>
                    <p className="text-[#77768C] text-xs md:text-sm mt-1">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            }
          />
        )}

        {/* Video Section - Only show if videoUrl exists */}
        {videoUrl && (
          <DetailRow
            label="Animation Demo"
            content={
              <div className="w-full">
                <video
                  ref={videoRef}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full rounded-xl border-4 border-[#007AFF] shadow-lg"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="text-[#77768C] text-sm mt-2">
                  Watch the smooth animations and interactions in action
                </p>
              </div>
            }
          />
        )}

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
        {galleryImages.length > 0 && (
          <DetailRow
            label="Gallery"
            content={
              <div className="grid grid-cols-2 col-span-5 gap-5">
                {galleryImages.map((image, index) => (
                  <ZoomableImage
                    key={index}
                    src={image.src}
                    alt={image.alt}
                  />
                ))}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
