export function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function focusSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  section.tabIndex = -1;
  section.focus({ preventScroll: true });
}
