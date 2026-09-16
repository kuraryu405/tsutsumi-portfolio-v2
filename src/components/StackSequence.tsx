import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { CSSVariables } from "../types/portfolio";

export type StackItemState =
  | "active"
  | "previous"
  | "collapsed"
  | "next"
  | "future";

export interface StackItemRenderContext<T> {
  index: number;
  itemId: T;
  state: StackItemState;
  isActive: boolean;
}

export interface StackNavigation<T> {
  previousId: T | null;
  nextId: T | null;
  goPrevious: () => void;
  goNext: () => void;
}

interface StackSequenceProps<T extends string | number> {
  id: string;
  ariaLabel: string;
  items: readonly T[];
  activeId: T;
  onActiveChange: (itemId: T) => void;
  onNavigate: (itemId: T) => void;
  getPreviousId: (itemId: T) => T | null;
  getNextId: (itemId: T) => T | null;
  onBoundary?: (direction: "previous" | "next") => void;
  renderNavigation?: (navigation: StackNavigation<T>) => ReactNode;
  children: (itemId: T, context: StackItemRenderContext<T>) => ReactNode;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getStackState(index: number, activeIndex: number): StackItemState {
  if (index === activeIndex) return "active";
  if (index === activeIndex - 1) return "previous";
  if (index < activeIndex - 1) return "collapsed";
  if (index === activeIndex + 1) return "next";
  return "future";
}

export function StackSequence<T extends string | number>({
  id,
  ariaLabel,
  items,
  activeId,
  onActiveChange,
  onNavigate,
  getPreviousId,
  getNextId,
  onBoundary,
  renderNavigation,
  children,
}: StackSequenceProps<T>) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const updateFromScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section || !items.length) return;

    if (reducedMotion) {
      const cards = Array.from(
        stageRef.current?.querySelectorAll<HTMLElement>("[data-stack-item]") ?? [],
      );
      const focusLine = window.innerHeight * 0.38;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.top - focusLine);
        if (rect.top <= focusLine && rect.bottom >= focusLine) {
          closestIndex = index;
          closestDistance = 0;
          return;
        }
        if (distance < closestDistance) {
          closestIndex = index;
          closestDistance = distance;
        }
      });

      setScrollPosition(closestIndex);
      onActiveChange(items[closestIndex]);
      return;
    }

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = clamp((window.scrollY - sectionTop) / range);
    const position = progress * Math.max(0, items.length - 1);
    const nextIndex = Math.round(position);

    setScrollPosition(position);
    onActiveChange(items[nextIndex]);
  }, [items, onActiveChange, reducedMotion]);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        updateFromScroll();
      });
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [updateFromScroll]);

  useEffect(() => {
    const nextPosition = Math.max(0, items.indexOf(activeId));
    setScrollPosition((current) => {
      if (reducedMotion) return current;
      return Math.round(current) === nextPosition ? current : nextPosition;
    });
  }, [activeId, items, reducedMotion]);

  const previousId = getPreviousId(activeId);
  const nextId = getNextId(activeId);
  const navigation = useMemo<StackNavigation<T>>(
    () => ({
      previousId,
      nextId,
      goPrevious: () => {
        if (previousId !== null) onNavigate(previousId);
        else onBoundary?.("previous");
      },
      goNext: () => {
        if (nextId !== null) onNavigate(nextId);
        else onBoundary?.("next");
      },
    }),
    [nextId, onBoundary, onNavigate, previousId],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const section = sectionRef.current;
      if (!section || event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT"
      ) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const isActive = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!isActive) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigation.goPrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigation.goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigation]);

  const activePosition = Math.min(
    Math.max(0, Math.round(scrollPosition)),
    Math.max(0, items.length - 1),
  );

  return (
    <section
      className="stack-sequence"
      id={id}
      ref={sectionRef}
      aria-label={ariaLabel}
      style={
        {
          "--stack-sequence-height": `${(Math.max(1, items.length) + 0.75) * 100}svh`,
        } as CSSVariables
      }
    >
      <div className="stack-sequence-sticky">
        <div className="stack-sequence-stage" ref={stageRef}>
          {items.map((itemId, index) => {
            const state = reducedMotion ? "active" : getStackState(index, activePosition);
            const isActive = reducedMotion ? true : state === "active";
            const isInactive = !reducedMotion && !isActive;

            return (
              <div
                className={`stack-sequence-item stack-sequence-item--${state}`}
                data-stack-item="true"
                data-stack-id={String(itemId)}
                key={String(itemId)}
                aria-hidden={isInactive ? true : undefined}
                inert={isInactive ? true : undefined}
              >
                {children(itemId, {
                  index,
                  itemId,
                  state,
                  isActive,
                })}
              </div>
            );
          })}
        </div>
        {renderNavigation?.(navigation)}
      </div>
    </section>
  );
}
