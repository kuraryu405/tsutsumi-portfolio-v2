import { useEffect, useState } from "react";
import { sections } from "../data/portfolio";

export function useSectionTracking() {
  const [active, setActive] = useState<string>("intro");

  useEffect(() => {
    const observed = sections
      .map(([id]) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const visibility = new Map<Element, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry));
        const visible = Array.from(visibility.values())
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRect.height - a.intersectionRect.height);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: Array.from({ length: 21 }, (_, index) => index / 20) },
    );

    observed.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
}
