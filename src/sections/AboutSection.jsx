import { useRef, useState } from "react";
import { PageCount } from "../components/PageCount";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { hobbies } from "../data/portfolio";

export function AboutSection() {
  const [lockedHobby, setLockedHobby] = useState(0);
  const [previewHobby, setPreviewHobby] = useState(null);
  const dragStart = useRef(null);
  const active = previewHobby ?? lockedHobby;

  const selectHobby = (index) => {
    setLockedHobby(index);
    setPreviewHobby(null);
  };

  const endDrag = (event) => {
    if (dragStart.current === null) return;

    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 38) {
      setLockedHobby((current) => {
        if (distance < 0) return (current + 1) % hobbies.length;
        return (current - 1 + hobbies.length) % hobbies.length;
      });
    }

    setPreviewHobby(null);
    dragStart.current = null;
  };

  return (
    <section
      className="viewport-section about-section"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="section-topline dark">
        <span>05 / OFF THE KEYBOARD</span>
        <span>HOVER TO PREVIEW / CLICK TO HOLD</span>
      </div>
      <div className="about-copy">
        <h2 id="about-title">
          コードの外にも、
          <br />
          好きがある。
        </h2>
        <div className="hobby-description" aria-live="polite">
          <span>0{active + 1}</span>
          <strong>{hobbies[active].title}</strong>
          <p>{hobbies[active].text}</p>
        </div>
      </div>
      <div
        className="strip-deck"
        onPointerLeave={() => setPreviewHobby(null)}
        onPointerDown={(event) => {
          dragStart.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={endDrag}
        onPointerCancel={() => {
          setPreviewHobby(null);
          dragStart.current = null;
        }}
      >
        {hobbies.map((hobby, index) => (
          <button
            className={index === active ? "photo-strip active" : "photo-strip"}
            type="button"
            onPointerEnter={() => setPreviewHobby(index)}
            onFocus={() => setPreviewHobby(index)}
            onBlur={() => setPreviewHobby(null)}
            onClick={() => selectHobby(index)}
            key={hobby.title}
            aria-pressed={lockedHobby === index}
          >
            <ResponsiveImage
              src={hobby.image}
              width={hobby.imageWidth}
              height={hobby.imageHeight}
              widths={hobby.imageWidths}
              sizes="(max-width: 760px) 70vw, 34vw"
              alt={hobby.title}
              draggable="false"
            />
            <span>{hobby.label}</span>
          </button>
        ))}
      </div>
      <div className="hobby-tabs">
        {hobbies.map((hobby, index) => (
          <button
            type="button"
            className={index === active ? "active" : ""}
            onMouseEnter={() => setPreviewHobby(index)}
            onMouseLeave={() => setPreviewHobby(null)}
            onFocus={() => setPreviewHobby(index)}
            onBlur={() => setPreviewHobby(null)}
            onClick={() => selectHobby(index)}
            key={hobby.title}
          >
            {hobby.label}
          </button>
        ))}
      </div>
      <PageCount current={5} dark />
    </section>
  );
}
