import { useCallback, useEffect, useRef, useState } from "react";
import { works } from "../data/portfolio";
import { clamp } from "../lib/math";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useProjectNavigation() {
  const [selectedWork, setSelectedWork] = useState(1);
  const [projectStartIndex, setProjectStartIndex] = useState(0);
  const [projectProgress, setProjectProgress] = useState(1 / (works.length - 1));
  const [launch, setLaunch] = useState(null);
  const launchTimers = useRef([]);

  const getSequencePosition = useCallback(
    (index, startIndex = projectStartIndex) =>
      (index - startIndex + works.length) % works.length,
    [projectStartIndex],
  );

  const scrollToProject = useCallback((index, behavior = "smooth", startIndex) => {
    const section = document.getElementById("project");
    if (!section) return;

    if (prefersReducedMotion()) {
      document.getElementById(`project-${works[index].slug}`)?.scrollIntoView({ behavior });
      return;
    }

    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const position = getSequencePosition(index, startIndex);
    const top = section.offsetTop + (position / (works.length - 1)) * range;
    window.scrollTo({ top, behavior });
  }, [getSequencePosition]);

  const launchProject = useCallback(
    (index, element) => {
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

        setProjectProgress(progress);
        setSelectedWork((current) => (current === index ? current : index));
      });
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [projectStartIndex]);

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
