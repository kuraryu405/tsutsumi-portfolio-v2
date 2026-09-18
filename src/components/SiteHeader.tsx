import { List, X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { sections } from "../data/portfolio";
import { focusSection } from "../lib/navigation";

interface SiteHeaderProps {
  active: string;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  onProjectNavigate?: () => void;
}

export function SiteHeader({
  active,
  menuOpen,
  setMenuOpen,
  onProjectNavigate,
}: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const header = headerRef.current;
    const main = document.querySelector("main");
    if (!header || !main) return;
    const wasInert = main.inert;
    const previousOverflow = document.body.style.overflow;
    main.inert = true;
    document.body.style.overflow = "hidden";
    header.querySelector<HTMLElement>(".site-nav a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(header.querySelectorAll<HTMLElement>("a, button"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 761px)");
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      main.inert = wasInert;
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <header ref={headerRef} className={menuOpen ? "site-header menu-open" : "site-header"}>
      <a
        className="brand"
        href="#intro"
        aria-label="最初の画面へ"
        onClick={closeMenu}
      >
        つつみん
      </a>

      <nav
        className={menuOpen ? "site-nav open" : "site-nav"}
        aria-label="ページ内ナビゲーション"
      >
        {sections.map(([id, label]) => (
          <a
            href={`#${id}`}
            className={active === id ? "active" : ""}
            key={id}
            onClick={() => {
              closeMenu();
              if (id === "project") onProjectNavigate?.();
              requestAnimationFrame(() => focusSection(id));
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        className="menu-toggle"
        ref={toggleRef}
        type="button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? <X size={20} /> : <List size={20} />}
      </button>
    </header>
  );
}
