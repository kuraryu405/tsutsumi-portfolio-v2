import { useEffect, useState } from "react";
import { sections } from "../data/portfolio";

export function useSectionTracking() {
  const [active, setActive] = useState<string>("intro");

  useEffect(() => {
    const observed = sections
      .map(([id]) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: [0.22, 0.45, 0.7] },
    );

    observed.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
}
