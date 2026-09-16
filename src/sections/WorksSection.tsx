import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { works } from "../data/portfolio";
import type { CSSVariables } from "../types/portfolio";

function getOrbitDensity(itemCount: number) {
  if (itemCount <= 4) return "density-large";
  if (itemCount <= 8) return "density-medium";
  return "density-small";
}

function getOrbitPosition(index: number, total: number): [string, string] {
  if (total <= 1) return ["50%", "46%"];
  const step = 360 / total;
  const angle = ((-90 - 180 / total + index * step) * Math.PI) / 180;
  const x = 50 + 34 * Math.cos(angle);
  const y = 50 + 36 * Math.sin(angle);
  return [`${x.toFixed(2)}%`, `${y.toFixed(2)}%`];
}

interface WorksSectionProps {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  onOpen: (index: number, element?: Element | null) => void;
}

export function WorksSection({ selected, setSelected, onOpen }: WorksSectionProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const orbitWorks = works;
  const selectedWork = works[selected] ?? orbitWorks[0];
  const density = getOrbitDensity(orbitWorks.length);

  const moveField = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    fieldRef.current?.style.setProperty("--orbit-x", x.toFixed(3));
    fieldRef.current?.style.setProperty("--orbit-y", y.toFixed(3));
  };

  const resetField = () => {
    fieldRef.current?.style.setProperty("--orbit-x", "0");
    fieldRef.current?.style.setProperty("--orbit-y", "0");
  };

  return (
    <section
      className="viewport-section works-section"
      id="works"
      aria-labelledby="works-title"
    >
      <div className="section-topline">
        <span>03 / SELECTED WORKS</span>
        <span>MOVE + SELECT</span>
      </div>
      <h2 id="works-title">
        つくったものは、
        <br />
        考えた跡。
      </h2>
      <div
        className={`orbit-field ${density}`}
        ref={fieldRef}
        onPointerMove={moveField}
        onPointerLeave={resetField}
      >
        <div className="orbit-ring ring-one" aria-hidden="true" />
        <div className="orbit-ring ring-two" aria-hidden="true" />
        <div className="orbit-core" aria-hidden="true">
          <span>{orbitWorks.length} BUILDS</span>
          <small>SELECT A PROJECT</small>
        </div>
        {orbitWorks.map((work, orbitIndex) => {
          const index = works.indexOf(work);
          const [nodeX, nodeY] = getOrbitPosition(orbitIndex, orbitWorks.length);
          return (
            <button
              type="button"
              className={selected === index ? "orbit-node active" : "orbit-node"}
              style={{
                "--node-x": nodeX,
                "--node-y": nodeY,
              } as CSSVariables}
              onMouseEnter={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onClick={(event) => {
                setSelected(index);
                onOpen(index, event.currentTarget);
              }}
              key={work.slug}
              aria-label={`${work.title}の詳細を見る`}
            >
              <span className="node-image">
                <ResponsiveImage
                  src={work.image}
                  width={work.imageWidth}
                  height={work.imageHeight}
                  widths={work.imageWidths}
                  sizes="(max-width: 760px) 46vw, 20vw"
                  alt=""
                  style={{ objectPosition: work.focus }}
                />
              </span>
              <span className="node-copy">
                <strong>{work.title}</strong>
                <small>{work.type}</small>
              </span>
            </button>
          );
        })}
      </div>
      <div className="work-readout">
        <span>ACTIVE / {String(selected + 1).padStart(2, "0")}</span>
        <strong>{selectedWork.title}</strong>
        <p>{selectedWork.description}</p>
        <button type="button" onClick={() => onOpen(selected)}>
          VIEW PROJECT <ArrowUpRight size={18} weight="bold" />
        </button>
      </div>
      <PageCount current={3} />
    </section>
  );
}
