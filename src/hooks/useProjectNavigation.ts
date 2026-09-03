import { useCallback, useEffect, useRef, useState } from "react";
import { works } from "../data/portfolio";
import { clamp } from "../lib/math";
import type { ProjectScrollBehavior, WorkLaunchState } from "../types/portfolio";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getNativeScrollBehavior(behavior: ProjectScrollBehavior): ScrollBehavior {
  return behavior === "instant" ? "auto" : behavior;
}

export function useProjectNavigation() {
  const [selectedWork, setSelectedWork] = useState(1);
  const [projectStartIndex, setProjectStartIndex] = useState(0);
  const [projectProgress, setProjectProgress] = useState(1 / (works.length - 1));
  const [launch, setLaunch] = useState<WorkLaunchState | null>(null);
  const launchTimers = useRef<number[]>([]);
  const settleTimer = useRef<number | null>(null);

  const getSequencePosition = useCallback(
    (index: number, startIndex = projectStartIndex) =>
      (index - startIndex + works.length) % works.length,
    [projectStartIndex],
  );

  const scrollToProject = useCallback((
    index: number,
    behavior: ProjectScrollBehavior = "smooth",
    startIndex?: number,
  ) => {
    const section = document.getElementById("project");
    if (!section) return;

    if (prefersReducedMotion()) {
      document.getElementById(`project-${works[index].slug}`)?.scrollIntoView({
        behavior: getNativeScrollBehavior(behavior),
      });
      return;
    }

    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const position = getSequencePosition(index, startIndex);
    const top = section.offsetTop + (position / (works.length - 1)) * range;
    window.scrollTo({ top, behavior: getNativeScrollBehavior(behavior) });
  }, [getSequencePosition]);

  const launchProject = useCallback(
    (index: number, element?: Element | null) => {
      setSelectedWork(index);
      setProjectStartIndex(index);
      const image = element?.querySelector(".node-image");

      if (!image || prefersReducedMotion()) {
        scrollToProject(index, "smooth", index);
        return;
      }

      launchTimers.current.forEach(window.clearTimeout);
      const rect = image.getBoundingClientRect();
      setLaunch({ index, rect, open: false });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLaunch((current) => (current ? { ...current, open: true } : current));
        });
      });

      launchTimers.current = [
        window.setTimeout(() => scrollToProject(index, "instant", index), 520),
        window.setTimeout(() => setLaunch(null), 760),
      ];
    },
    [scrollToProject],
  );

  useEffect(
    () => () => {
      launchTimers.current.forEach(window.clearTimeout);
      if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    },
    [],
  );

  useEffect(() => {
    let frame = 0;

    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const project = document.getElementById("project");
        if (!project || prefersReducedMotion()) return;

        const rect = project.getBoundingClientRect();
        const distance = Math.max(1, project.offsetHeight - window.innerHeight);
        const progress = clamp(-rect.top / distance);
        const position = Math.round(progress * (works.length - 1));
        const index = (projectStartIndex + position) % works.length;
        const snappedProgress = position / (works.length - 1);

        setProjectProgress(snappedProgress);
        setSelectedWork((current) => (current === index ? current : index));

        if (
          rect.top < 0 &&
          rect.bottom > window.innerHeight &&
          Math.abs(progress - snappedProgress) > 0.002
        ) {
          if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
          settleTimer.current = window.setTimeout(() => {
            scrollToProject(index, "smooth", projectStartIndex);
          }, 110);
        }
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      cancelAnimationFrame(frame);
      if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [projectStartIndex, scrollToProject]);

  return {
    launch,
    launchProject,
    projectProgress,
    projectStartIndex,
    scrollToProject,
    selectedWork,
    setSelectedWork,
  };
}
