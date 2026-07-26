import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { works } from "../data/portfolio";

function getOrbitDensity(itemCount) {
  if (itemCount <= 4) return "density-large";
  if (itemCount <= 6) return "density-medium";
  return "density-small";
}

export function WorksSection({ selected, setSelected, onOpen }) {
  const fieldRef = useRef(null);
  const density = getOrbitDensity(works.length);

  const moveField = (event) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    fieldRef.current.style.setProperty("--orbit-x", x.toFixed(3));
    fieldRef.current.style.setProperty("--orbit-y", y.toFixed(3));
  };

  const resetField = () => {
    fieldRef.current?.style.setProperty("--orbit-x", 0);
    fieldRef.current?.style.setProperty("--orbit-y", 0);
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
          <span>4 BUILDS</span>
          <small>SELECT A PROJECT</small>
        </div>
        {works.map((work, index) => (
          <button
            type="button"
            className={selected === index ? "orbit-node active" : "orbit-node"}
            style={{ "--node-x": work.position[0], "--node-y": work.position[1] }}
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
              <img src={work.image} alt="" style={{ objectPosition: work.focus }} />
            </span>
            <span className="node-copy">
              <strong>{work.title}</strong>
              <small>{work.type}</small>
            </span>
          </button>
        ))}
      </div>
      <div className="work-readout" aria-live="polite">
        <span>ACTIVE / 0{selected + 1}</span>
        <strong>{works[selected].title}</strong>
        <p>{works[selected].description}</p>
        <button type="button" onClick={() => onOpen(selected)}>
          VIEW PROJECT <ArrowUpRight size={18} weight="bold" />
        </button>
      </div>
      <PageCount current={3} />
    </section>
  );
}

