import { useCallback, useEffect, useRef, useState } from "react";
import { works } from "../data/portfolio";
import { clamp } from "../lib/math";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useProjectNavigation() {
  const [selectedWork, setSelectedWork] = useState(1);
  const [projectProgress, setProjectProgress] = useState(1 / (works.length - 1));
  const [launch, setLaunch] = useState(null);
  const launchTimers = useRef([]);

  const scrollToProject = useCallback((index, behavior = "smooth") => {
    const section = document.getElementById("project");
    if (!section) return;

    if (prefersReducedMotion()) {
      document.getElementById(`project-${works[index].slug}`)?.scrollIntoView({ behavior });
      return;
    }

    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const top = section.offsetTop + (index / (works.length - 1)) * range;
    window.scrollTo({ top, behavior });
  }, []);

  const launchProject = useCallback(
    (index, element) => {
      setSelectedWork(index);
      const image = element?.querySelector(".node-image");

      if (!image || prefersReducedMotion()) {
        scrollToProject(index);
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
        window.setTimeout(() => scrollToProject(index, "instant"), 520),
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
        const index = Math.round(progress * (works.length - 1));

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
  }, []);

  return {
    launch,
    launchProject,
    projectProgress,
    scrollToProject,
    selectedWork,
    setSelectedWork,
  };
}

