import Image, { StaticImageData } from "next/image";

export interface FrameworkProps {
  body: string;
  title: string;
  framworkImage: StaticImageData;
}

const Framework = ({ title, body, framworkImage }: FrameworkProps) => {
  return (
    <div className="flex flex-col border-2 border-[#1D283A] rounded-lg p-5 gap-y-3">
      <div>
        <Image src={framworkImage} alt="framework" width={50}></Image>
      </div>
      <div className="font-bold text-white">{title}</div>
      <div className=" text-[#B0B0B0] text-sm font-medium">{body}</div>
    </div>
  );
};

export default Framework;
