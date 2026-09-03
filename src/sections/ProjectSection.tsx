import { useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { works } from "../data/portfolio";
import type { CSSVariables, ProjectScrollBehavior } from "../types/portfolio";

interface ProjectRailProps {
  activeIndex: number;
  sequence: number[];
  onNavigate: (index: number, behavior?: ProjectScrollBehavior) => void;
}

function ProjectRail({ activeIndex, sequence, onNavigate }: ProjectRailProps) {
  const activePosition = sequence.indexOf(activeIndex);
  const previousIndex = activePosition > 0 ? sequence[activePosition - 1] : null;
  const nextIndex =
    activePosition < sequence.length - 1 ? sequence[activePosition + 1] : null;
  const previous = previousIndex === null ? null : works[previousIndex];
  const next = nextIndex === null ? null : works[nextIndex];

  return (
    <div className="project-rail">
      <button
        className="project-neighbor previous"
        type="button"
        disabled={!previous}
        onClick={() => {
          if (previousIndex !== null) onNavigate(previousIndex);
        }}
      >
        <ArrowLeft size={24} weight="bold" />
        {previous ? (
          <>
            <ResponsiveImage
              src={previous.image}
              width={previous.imageWidth}
              height={previous.imageHeight}
              widths={previous.imageWidths}
              sizes="120px"
              alt=""
            />
            <span>
              <small>PREVIOUS</small>
              <strong>{previous.title}</strong>
            </span>
          </>
        ) : (
          <span>
            <small>START</small>
            <strong>First project</strong>
          </span>
        )}
      </button>

      <div className="project-progress" aria-live="polite">
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <div>
          {sequence.map((workIndex) => (
            <button
              type="button"
              className={workIndex === activeIndex ? "active" : ""}
              onClick={() => onNavigate(workIndex)}
              aria-label={`${works[workIndex].title}へ移動`}
              key={works[workIndex].slug}
            />
          ))}
        </div>
        <span>{String(works.length).padStart(2, "0")}</span>
      </div>

      <button
        className="project-neighbor next"
        type="button"
        onClick={() => {
          if (nextIndex !== null) onNavigate(nextIndex);
          else document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {next ? (
          <>
            <span>
              <small>NEXT</small>
              <strong>{next.title}</strong>
            </span>
            <ResponsiveImage
              src={next.image}
              width={next.imageWidth}
              height={next.imageHeight}
              widths={next.imageWidths}
              sizes="120px"
              alt=""
            />
          </>
        ) : (
          <span>
            <small>NEXT CHAPTER</small>
            <strong>About me</strong>
          </span>
        )}
        <ArrowRight size={24} weight="bold" />
      </button>
    </div>
  );
}

interface ProjectSectionProps {
  progress: number;
  activeIndex: number;
  startIndex: number;
  onNavigate: (index: number, behavior?: ProjectScrollBehavior) => void;
}

export function ProjectSection({
  progress,
  activeIndex,
  startIndex,
  onNavigate,
}: ProjectSectionProps) {
  const sequence = useMemo(
    () => works.map((_, position) => (startIndex + position) % works.length),
    [startIndex],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const section = document.getElementById("project");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isActive = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!isActive) return;

      const activePosition = sequence.indexOf(activeIndex);

      if (event.key === "ArrowRight" && activePosition < sequence.length - 1) {
        event.preventDefault();
        onNavigate(sequence[activePosition + 1]);
      }
      if (event.key === "ArrowLeft" && activePosition > 0) {
        event.preventDefault();
        onNavigate(sequence[activePosition - 1]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onNavigate, sequence]);

  useEffect(() => {
    const section = document.getElementById("project");
    if (!section) return undefined;

    let touchStartY: number | null = null;
    let wheelDelta = 0;
    let wheelLocked = false;

    const moveOneProject = (direction: number) => {
      const rect = section.getBoundingClientRect();
      const isActive = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!isActive) return false;

      const activePosition = sequence.indexOf(activeIndex);
      const nextPosition = activePosition + direction;

      if (nextPosition >= 0 && nextPosition < sequence.length) {
        onNavigate(sequence[nextPosition]);
        return true;
      }

      const targetId = direction > 0 ? "about" : "works";
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      return true;
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - endY;
      touchStartY = null;
      if (Math.abs(delta) >= 24) moveOneProject(delta > 0 ? 1 : -1);
      else onNavigate(activeIndex);
    };

    const onWheel = (event: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const isActive = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!isActive || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      event.preventDefault();
      if (wheelLocked) return;

      wheelDelta += event.deltaY;
      if (Math.abs(wheelDelta) < 18) return;

      wheelLocked = true;
      moveOneProject(wheelDelta > 0 ? 1 : -1);
      wheelDelta = 0;
      window.setTimeout(() => {
        wheelLocked = false;
      }, 620);
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    section.addEventListener("touchstart", onTouchStart, { passive: true });
    section.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      section.removeEventListener("wheel", onWheel);
      section.removeEventListener("touchstart", onTouchStart);
      section.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeIndex, onNavigate, sequence]);

  return (
    <section
      className="project-scroll-section"
      id="project"
      aria-label="作品詳細"
      style={{
        "--project-height": `${(works.length + 1) * 100}svh`,
      } as CSSVariables}
    >
      <div className="project-sticky">
        <div
          className="project-track"
          style={{
            transform: `translate3d(${-progress * (works.length - 1) * 100}vw, 0, 0)`,
          }}
        >
          {sequence.map((workIndex) => {
            const work = works[workIndex];
            return (
              <article
                className="project-slide"
                id={`project-${work.slug}`}
                aria-labelledby={`project-title-${work.slug}`}
                key={work.slug}
              >
                <ResponsiveImage
                  className="project-backdrop"
                  src={work.image}
                  width={work.imageWidth}
                  height={work.imageHeight}
                  widths={work.imageWidths}
                  sizes="100vw"
                  alt=""
                  style={{ objectPosition: work.focus }}
                />
                <div className="project-scrim" aria-hidden="true" />
                <div className="project-meta">
                  <span>04 / PROJECT FOCUS</span>
                  <span>{work.year}</span>
                  <span>{work.type}</span>
                </div>
                <div className="project-copy">
                  <p>SELECTED WORK / 0{workIndex + 1}</p>
                  <h2 id={`project-title-${work.slug}`}>{work.title}</h2>
                  <strong>{work.detailCopy}</strong>
                  <a href={work.href} target="_blank" rel="noreferrer">
                    OPEN SITE <ArrowUpRight size={20} weight="bold" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <ProjectRail
          activeIndex={activeIndex}
          sequence={sequence}
          onNavigate={onNavigate}
        />
        <PageCount current={4} />
      </div>
    </section>
  );
}
