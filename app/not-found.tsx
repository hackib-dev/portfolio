import Link from "next/link";
import { PlateMeta } from "@/components/PlateHeader";
import { Pressed } from "@/features/shell/Pressed";

export default function NotFound() {
  return (
    <section className="plate">
      <div className="plate-grid">
        <PlateMeta code="404" label="Unmapped" />
        <div className="flex flex-col gap-5">
          <h1 id="page-heading" tabIndex={-1} className="display text-[clamp(44px,7vw,100px)] leading-[0.9] outline-none" style={{ ["--wdth" as string]: 90 }}>
            <Pressed text="No stratum here" />
          </h1>
          <p className="max-w-[52ch] text-[19px]">This page does not exist, or it has moved during the rebuild.</p>
          <Link href="/" className="btn self-start">
            Back to the surface
          </Link>
        </div>
      </div>
    </section>
  );
}
