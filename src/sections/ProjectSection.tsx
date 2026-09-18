import { useCallback, useEffect, useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { works } from "../data/portfolio";
import { focusSection, getScrollBehavior } from "../lib/navigation";

interface ProjectSectionProps {
  activeIndex: number;
  sequence: number[];
  onActiveChange: (index: number) => void;
}

export function ProjectSection({
  activeIndex,
  sequence,
  onActiveChange,
}: ProjectSectionProps) {
  const indexRef = useRef<HTMLDialogElement>(null);
  const order = useMemo(
    () => sequence.length ? sequence : works.map((_, index) => index),
    [sequence],
  );
  const activePosition = Math.max(0, order.indexOf(activeIndex));
  const safePosition = Number.isFinite(activePosition) && activePosition >= 0
    ? activePosition
    : 0;
  const total = order.length;
  const currentWorkIndex = order[safePosition] ?? 0;
  const work = works[currentWorkIndex];
  const workNumber = String(currentWorkIndex + 1).padStart(2, "0");

  const goToPosition = useCallback((position: number) => {
    const next = order[(position + total) % total];
    if (next !== undefined) onActiveChange(next);
  }, [order, total, onActiveChange]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.querySelector("dialog[open]") || document.querySelector("main")?.inert) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT"
      ) {
        return;
      }
      const section = document.getElementById("project");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.6 &&
        rect.bottom >= window.innerHeight * 0.4;
      if (!inView) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPosition(safePosition - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToPosition(safePosition + 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [safePosition, goToPosition]);

  if (!work) return null;

  return (
    <section
      className="viewport-section project-section"
      id="project"
      aria-label="作品詳細"
      tabIndex={-1}
    >
      <div className="section-topline">
        <span>04 / PROJECT FOCUS</span>
        <span>
          {String(safePosition + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="project-exhibit">
        <article
          className="project-card project-exhibit-card"
          id={`project-${work.slug}`}
          aria-labelledby={`project-title-${work.slug}`}
        >
          <div className="project-card-media project-exhibit-media">
            <ResponsiveImage
              src={work.image}
              width={work.imageWidth}
              height={work.imageHeight}
              widths={work.imageWidths}
              sizes="(max-width: 760px) calc(100vw - 40px), min(88vw, 1200px)"
              alt=""
              loading="eager"
              style={{ objectPosition: work.focus }}
            />
            <div className="project-scrim" aria-hidden="true" />
          </div>
          <div className="project-card-meta">
            <span>04 / PROJECT FOCUS</span>
            <span>{work.year}</span>
            <span>{work.type}</span>
          </div>
          <div className="project-card-copy">
            <p>SELECTED WORK / {workNumber}</p>
            <h2 id={`project-title-${work.slug}`}>{work.title}</h2>
            <strong>{work.detailCopy}</strong>
            <a href={work.href} target="_blank" rel="noreferrer">
              OPEN SITE <ArrowUpRight size={20} weight="bold" />
            </a>
          </div>
        </article>

      </div>

      <div className="project-controls">
        <button
          type="button"
          className="project-index-toggle"
          aria-haspopup="dialog"
          onClick={() => indexRef.current?.showModal()}
        >
          ALL WORKS / INDEX
        </button>
        <nav className="project-pager" aria-label="作品ナビゲーション">
          <button
            className="project-nav-button"
            type="button"
            onClick={() => goToPosition(safePosition - 1)}
            aria-label="前の作品へ移動"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <span
            className="project-nav-count"
            aria-label={`${safePosition + 1} / ${total}`}
          >
            {String(safePosition + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <button
            className="project-nav-button"
            type="button"
            onClick={() => goToPosition(safePosition + 1)}
            aria-label="次の作品へ移動"
          >
            <ArrowRight size={20} weight="bold" />
          </button>
        </nav>
        <button
          type="button"
          className="project-skip"
          onClick={() => {
            document.getElementById("about")?.scrollIntoView({ behavior: getScrollBehavior() });
            focusSection("about");
          }}
        >
          SKIP TO ABOUT ↓
        </button>
      </div>

      <dialog ref={indexRef} className="project-index" aria-labelledby="project-index-title">
        <div className="project-index-heading">
          <h3 id="project-index-title">ALL WORKS / INDEX</h3>
          <button type="button" onClick={() => indexRef.current?.close()} aria-label="作品一覧を閉じる">
            CLOSE ×
          </button>
        </div>
        <p className="project-index-label">
          <span>惑星以外からも直接ジャンプできます</span>
        </p>
        <ul>
          {order.map((workIndex, position) => {
            const item = works[workIndex];
            if (!item) return null;
            const isActive = workIndex === currentWorkIndex;
            return (
              <li key={item.slug}>
                <button
                  type="button"
                  className={isActive ? "project-index-item active" : "project-index-item"}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => {
                    if (!isActive) onActiveChange(workIndex);
                    indexRef.current?.close();
                    document.getElementById("project")?.scrollIntoView({ behavior: getScrollBehavior() });
                    focusSection("project");
                  }}
                >
                  <span>{String(position + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <small>{item.type}</small>
                </button>
              </li>
            );
          })}
        </ul>
      </dialog>

      <PageCount current={4} />
    </section>
  );
}
