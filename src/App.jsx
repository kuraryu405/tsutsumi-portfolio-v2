import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader } from "./components/SiteHeader";
import { WorkLaunch } from "./components/WorkLaunch";
import { useCursorAura } from "./hooks/useCursorAura";
import { useProjectNavigation } from "./hooks/useProjectNavigation";
import { useSectionTracking } from "./hooks/useSectionTracking";
import { AboutSection } from "./sections/AboutSection";
import { CommunitySection } from "./sections/CommunitySection";
import { IntroSection } from "./sections/IntroSection";
import { LinksSection } from "./sections/LinksSection";
import { ProfileSection } from "./sections/ProfileSection";
import { ProjectSection } from "./sections/ProjectSection";
import { WorksSection } from "./sections/WorksSection";

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef(null);
  const activeSection = useSectionTracking();
  const {
    launch,
    launchProject,
    projectProgress,
    scrollToProject,
    selectedWork,
    setSelectedWork,
  } = useProjectNavigation();

  useCursorAura(shellRef);

  const settleBootLoader = useCallback((mode = "ready") => {
    const loader = document.getElementById("boot-loader");
    if (!loader || loader.dataset.state === "hidden") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    loader.dataset.mode = mode;
    loader.dataset.state = "ready";
    document.documentElement.dataset.heroState = mode;

    window.setTimeout(() => {
      loader.dataset.state = "hidden";
      window.setTimeout(() => loader.remove(), reducedMotion ? 0 : 200);
    }, reducedMotion ? 0 : 180);
  }, []);

  useEffect(() => {
    const safetyTimeout = window.setTimeout(
      () => settleBootLoader("fallback"),
      2500,
    );
    return () => window.clearTimeout(safetyTimeout);
  }, [settleBootLoader]);

  return (
    <div className="site-shell" ref={shellRef}>
      <div className="cursor-aura" aria-hidden="true" />
      <SiteHeader
        active={activeSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <IntroSection onSettled={settleBootLoader} />
        <ProfileSection />
        <WorksSection
          selected={selectedWork}
          setSelected={setSelectedWork}
          onOpen={launchProject}
        />
        <ProjectSection
          progress={projectProgress}
          activeIndex={selectedWork}
          onNavigate={scrollToProject}
        />
        <AboutSection />
        <CommunitySection />
        <LinksSection />
      </main>
      <WorkLaunch launch={launch} />
    </div>
  );
}
