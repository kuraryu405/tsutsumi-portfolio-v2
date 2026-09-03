import { useEffect } from "react";
import type { RefObject } from "react";

export function useCursorAura(shellRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const moveCursor = (event: PointerEvent) => {
      shellRef.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
      shellRef.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    return () => window.removeEventListener("pointermove", moveCursor);
  }, [shellRef]);
}
