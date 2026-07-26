import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { works } from "../data/portfolio";

function ProjectRail({ activeIndex, onNavigate }) {
  const previous = activeIndex > 0 ? works[activeIndex - 1] : null;
  const next = activeIndex < works.length - 1 ? works[activeIndex + 1] : null;

  return (
    <div className="project-rail">
      <button
        className="project-neighbor previous"
        type="button"
        disabled={!previous}
        onClick={() => previous && onNavigate(activeIndex - 1)}
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
          {works.map((work, index) => (
            <button
              type="button"
              className={index === activeIndex ? "active" : ""}
              onClick={() => onNavigate(index)}
              aria-label={`${work.title}へ移動`}
              key={work.slug}
            />
          ))}
        </div>
        <span>{String(works.length).padStart(2, "0")}</span>
      </div>

      <button
        className="project-neighbor next"
        type="button"
        onClick={() => {
          if (next) onNavigate(activeIndex + 1);
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

export function ProjectSection({ progress, activeIndex, onNavigate }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      const section = document.getElementById("project");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isActive = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!isActive) return;

      if (event.key === "ArrowRight" && activeIndex < works.length - 1) {
        event.preventDefault();
        onNavigate(activeIndex + 1);
      }
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        event.preventDefault();
        onNavigate(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onNavigate]);

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
          {works.map((work, index) => (
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
                <p>SELECTED WORK / 0{index + 1}</p>
                <h2 id={`project-title-${work.slug}`}>{work.title}</h2>
                <strong>{work.detailCopy}</strong>
                <a href={work.href} target="_blank" rel="noreferrer">
                  OPEN SITE <ArrowUpRight size={20} weight="bold" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <ProjectRail activeIndex={activeIndex} onNavigate={onNavigate} />
        <PageCount current={4} />
      </div>
    </section>
  );
}
