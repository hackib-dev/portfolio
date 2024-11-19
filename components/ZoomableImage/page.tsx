import Image, { StaticImageData } from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface ZoomableImageProps {
  src: StaticImageData | string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({
  src,
  alt,
  className,
}: ZoomableImageProps) {
  if (!src) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src={src}
          alt={alt || ""}
          sizes="100vw"
          className={className}
          style={{
            width: "100%",
            height: "auto",
          }}
          width={500}
          height={100}
        />
      </DialogTrigger>
      <DialogContent className="max-w-7xl  border-0 bg-transparent p-5 md:p-0">
        <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
          <Image
            src={src}
            fill
            alt={alt || ""}
            className="h-full w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
