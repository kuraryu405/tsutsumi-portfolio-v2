import { works } from "../data/portfolio";
import type { WorkLaunchState } from "../types/portfolio";
import { ResponsiveImage } from "./ResponsiveImage";

interface WorkLaunchProps {
  launch: WorkLaunchState | null;
}

export function WorkLaunch({ launch }: WorkLaunchProps) {
  if (!launch) return null;

  const work = works[launch.index];
  const frame = launch.open
    ? { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }
    : {
        top: launch.rect.top,
        left: launch.rect.left,
        width: launch.rect.width,
        height: launch.rect.height,
        borderRadius: 14,
      };

  return (
    <div
      className={launch.open ? "work-launch open" : "work-launch"}
      style={frame}
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
      <span>{work.title}</span>
    </div>
  );
}
