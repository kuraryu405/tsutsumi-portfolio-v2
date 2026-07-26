import { List, X } from "@phosphor-icons/react";
import { sections } from "../data/portfolio";

export function SiteHeader({ active, menuOpen, setMenuOpen }) {
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={menuOpen ? "site-header menu-open" : "site-header"}>
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
            onClick={closeMenu}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        className="menu-toggle"
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
