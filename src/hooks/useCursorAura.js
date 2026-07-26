import { useEffect } from "react";

export function useCursorAura(shellRef) {
  useEffect(() => {
    const moveCursor = (event) => {
      shellRef.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
      shellRef.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    return () => window.removeEventListener("pointermove", moveCursor);
  }, [shellRef]);
}
