import { works } from "../data/portfolio";
import type { WorkLaunchState } from "../types/portfolio";
import { ResponsiveImage } from "./ResponsiveImage";

interface WorkLaunchProps {
  launch: WorkLaunchState | null;
}

export function WorkLaunch({ launch }: WorkLaunchProps) {
  if (!launch) return null;

  const work = works[launch.index];
  const rect = launch.phase === "landing" && launch.landingRect
    ? launch.landingRect
    : launch.startRect;
  const borderRadius = launch.phase === "landing"
    ? launch.landingRadius
    : launch.startRadius;

  return (
    <div
      className={`work-launch ${launch.phase}`}
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius,
      }}
      aria-hidden="true"
    >
      <ResponsiveImage
        src={work.image}
        width={work.imageWidth}
        height={work.imageHeight}
        widths={work.imageWidths}
        sizes="100vw"
        loading="eager"
        alt=""
        style={{ objectPosition: work.focus }}
      />
    </div>
  );
}
