import { useRef, useState } from "react";
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

  return (
    <div className="site-shell" ref={shellRef}>
      <div className="cursor-aura" aria-hidden="true" />
      <SiteHeader
        active={activeSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <IntroSection />
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
