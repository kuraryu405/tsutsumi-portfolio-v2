import { useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { works } from "../data/portfolio";

function ProjectRail({ activeIndex, sequence, onNavigate }) {
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
        onClick={() => previous && onNavigate(previousIndex)}
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
          if (next) onNavigate(nextIndex);
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

export function ProjectSection({ progress, activeIndex, startIndex, onNavigate }) {
  const sequence = useMemo(
    () => works.map((_, position) => (startIndex + position) % works.length),
    [startIndex],
  );

  useEffect(() => {
    const onKeyDown = (event) => {
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

  return (
    <section
      className="project-scroll-section"
      id="project"
      aria-label="作品詳細"
      style={{ "--project-height": `${(works.length + 1) * 100}svh` }}
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
