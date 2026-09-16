import { useCallback, useEffect, useRef, useState } from "react";
import { works } from "../data/portfolio";
import type { ProjectScrollBehavior, WorkLaunchState } from "../types/portfolio";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getNativeScrollBehavior(behavior: ProjectScrollBehavior): ScrollBehavior {
  return behavior === "instant" ? "auto" : behavior;
}

function getRectRadius(element: Element) {
  return window.getComputedStyle(element).borderRadius || "0px";
}

function waitForFrames(count: number, callback: () => void) {
  if (count <= 0) {
    callback();
    return;
  }

  window.requestAnimationFrame(() => waitForFrames(count - 1, callback));
}

function scrollInstant(top: number) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = previousBehavior;
}

function getProjectTop() {
  const section = document.getElementById("project");
  if (!section) return null;
  return window.scrollY + section.getBoundingClientRect().top;
}

export function useProjectNavigation() {
  const [planetSelection, setPlanetSelection] = useState(1);
  const [stackActiveIndex, setStackActiveIndex] = useState(0);
  const [launch, setLaunch] = useState<WorkLaunchState | null>(null);
  const launchTimers = useRef<number[]>([]);
  const projectSequence = useRef(works.map((_, index) => index)).current;

  const clearLaunchTimers = useCallback(() => {
    launchTimers.current.forEach(window.clearTimeout);
    launchTimers.current = [];
  }, []);

  const scrollToProject = useCallback(
    (index: number, behavior: ProjectScrollBehavior = "smooth") => {
      const work = works[index];
      if (!work) return;

      setStackActiveIndex(index);

      const top = getProjectTop();
      if (top === null) return;
      if (behavior === "instant") {
        scrollInstant(top);
      } else {
        window.scrollTo({
          top,
          behavior: getNativeScrollBehavior(behavior),
        });
      }
    },
    [],
  );

  const launchProject = useCallback(
    (index: number, element?: Element | null) => {
      const work = works[index];
      if (!work) return;

      clearLaunchTimers();
      setPlanetSelection(index);
      setStackActiveIndex(index);

      const source = element?.querySelector<HTMLElement>(".node-image");
      if (!source || prefersReducedMotion()) {
        setLaunch(null);
        scrollToProject(index, "smooth");
        return;
      }

      const startRect = source.getBoundingClientRect();
      const startRadius = getRectRadius(source);
      setLaunch({
        index,
        startRect,
        landingRect: null,
        startRadius,
        landingRadius: startRadius,
        phase: "captured",
      });

      waitForFrames(1, () => {
        scrollToProject(index, "instant");
        waitForFrames(3, () => {
          const target = document.querySelector<HTMLElement>(
            `#project-${work.slug} .project-exhibit-media`,
          );

          if (!target) {
            setLaunch(null);
            return;
          }

          const landingRect = target.getBoundingClientRect();
          const landingRadius = getRectRadius(target);
          setLaunch((current) =>
            current
              ? {
                  ...current,
                  landingRect,
                  landingRadius,
                  phase: "landing",
                }
              : current,
          );
          launchTimers.current.push(
            window.setTimeout(() => setLaunch(null), 760),
          );
        });
      });
    },
    [clearLaunchTimers, scrollToProject],
  );

  const resetProjectSequence = useCallback(() => {
    clearLaunchTimers();
    setLaunch(null);
  }, [clearLaunchTimers]);

  useEffect(
    () => () => clearLaunchTimers(),
    [clearLaunchTimers],
  );

  return {
    launch,
    launchProject,
    planetSelection,
    projectSequence,
    resetProjectSequence,
    scrollToProject,
    setPlanetSelection,
    setStackActiveIndex,
    stackActiveIndex,
  };
}
