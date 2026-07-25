import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  List,
  X,
} from "@phosphor-icons/react";

const works = [
  {
    slug: "portfolio",
    href: "https://kuraryu.jp",
    title: "Portfolio",
    image: "/images/portfolio.png",
    description:
      "Next.jsで作った最初のポートフォリオ。つくり直すたび、今の自分が見えてくる。",
    detailCopy: "今の自分を、次の自分へ渡す。",
    type: "Web design / Development",
    year: "2024",
    position: ["29%", "22%"],
    focus: "50% 44%",
  },
  {
    slug: "happa",
    href: "https://kuraryu.jp/Happa",
    title: "Happa",
    image: "/images/Happalogo.png",
    description:
      "友達との飲み会や合宿で、聞けなかったことを匿名で聞ける質問Webゲーム。",
    detailCopy: "聞けなかったこと、化けて聞こう。",
    type: "Web game / Full stack",
    year: "2024",
    position: ["72%", "14%"],
    focus: "50% 50%",
  },
  {
    slug: "long-long-url",
    href: "https://kuraryu.jp/long-long-url",
    title: "long-long-url",
    image: "/images/longurl.png",
    description:
      "URLを意味もなく長くする、日常を少しだけ不便にするためのWeb実験。",
    detailCopy: "便利すぎる日常に、ひとつ無駄を。",
    type: "Web experiment",
    year: "2024",
    position: ["80%", "66%"],
    focus: "50% 50%",
  },
  {
    slug: "iniad-quest",
    href: "https://kuraryu.jp/iniad-quest/",
    title: "INIAD Quest",
    image: "/images/INIAD-Quest.jpg",
    description:
      "INIAD生の学習を支えるため、学内情報から試験の模擬問題をつくったサイト。",
    detailCopy: "解くほど、次に進みたくなる学習を。",
    type: "Learning support",
    year: "2025",
    position: ["34%", "70%"],
    focus: "50% 48%",
  },
];

const hobbies = [
  {
    image: "/images/ueda.webp",
    title: "Photography",
    label: "PHOTOGRAPHY",
    text: "光と空気ごと残せる写真が好き。次に狙っているのは1DX。",
  },
  {
    image: "/images/pc.webp",
    title: "Computers",
    label: "PC",
    text: "自作PCはArch Linux。MacBookとVivoBookも、用途ごとに使い分ける。",
  },
  {
    image: "/images/euphonium.webp",
    title: "Euphonium",
    label: "EUPHONIUM",
    text: "大学の吹奏楽サークルで、低くて温かい音を鳴らしています。",
  },
  {
    image: "/images/karaoke.webp",
    title: "Music",
    label: "KARAOKE",
    text: "歌うことも、オルタナティブを聴くことも。時速36kmが好き。",
  },
];

const affiliations = [
  {
    href: "https://tekunotes.com",
    title: "TEKUNOTES",
    image: "/images/tekunotes.webp",
    description: "ガジェットを、使った言葉で伝える。",
  },
  {
    href: "https://tgrgroup.jp",
    title: "TGR",
    image: "/images/tgr-color.min.svg",
    description: "学生同士で、つくる熱をつなぐ。",
  },
  {
    href: "https://geeken-iniad.org/",
    title: "GeeKen",
    image: "/images/geeken.png",
    description: "大学の技術系サークルで動く。",
  },
];

const socialLinks = [
  {
    href: "https://x.com/tsutsumin_dev",
    title: "X",
    handle: "@tsutsumin_dev",
    image: "/images/x.svg",
  },
  {
    href: "https://github.com/kuraryu405",
    title: "GitHub",
    handle: "kuraryu405",
    image: "/images/github.svg",
  },
  {
    href: "https://qiita.com/kuraryu405",
    title: "Qiita",
    handle: "kuraryu405",
    image: "/images/qiita-icon.png",
  },
];

const sections = [
  ["intro", "INTRO"],
  ["works", "WORKS"],
  ["project", "PROJECT"],
  ["about", "ABOUT"],
  ["affiliations", "COMMUNITY"],
  ["links", "LINKS"],
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const smoothstep = (value) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

function drawImageCover(context, image, frame, focusX = 0.52, focusY = 0.48) {
  const scale = Math.max(frame.width / image.naturalWidth, frame.height / image.naturalHeight);
  const sourceWidth = frame.width / scale;
  const sourceHeight = frame.height / scale;
  const sourceX = clamp(
    image.naturalWidth * focusX - sourceWidth / 2,
    0,
    image.naturalWidth - sourceWidth,
  );
  const sourceY = clamp(
    image.naturalHeight * focusY - sourceHeight / 2,
    0,
    image.naturalHeight - sourceHeight,
  );

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
  );
}

function PageCount({ current, dark = false }) {
  return (
    <p className={dark ? "page-count dark" : "page-count"}>
      <span>{String(current).padStart(2, "0")}</span>
      <i />
      06
    </p>
  );
}

function useSectionTracking() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const observed = sections
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: [0.22, 0.45, 0.7] },
    );
    observed.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
}

function SiteHeader({ active, menuOpen, setMenuOpen }) {
  return (
    <header className={menuOpen ? "site-header menu-open" : "site-header"}>
      <a
        className="brand"
        href="#intro"
        aria-label="最初の画面へ"
        onClick={() => setMenuOpen(false)}
      >
        TSUTSUMI
      </a>

      <nav className={menuOpen ? "site-nav open" : "site-nav"} aria-label="ページ内ナビゲーション">
        {sections.map(([id, label]) => (
          <a
            href={`#${id}`}
            className={active === id ? "active" : ""}
            key={id}
            onClick={() => setMenuOpen(false)}
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

function IntroCanvas({ progress }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = "/images/pc.webp";
    image.onload = () => {
      imageRef.current = image;
      setReady(true);
    };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;

    let cancelled = false;
    const draw = () => {
      if (cancelled || !canvasRef.current || !imageRef.current) return;
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const density = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);

      const context = canvas.getContext("2d");
      context.setTransform(density, 0, 0, density, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#090909";
      context.fillRect(0, 0, width, height);

      const mobile = width <= 760;
      const fontSize = mobile
        ? Math.min(width * 0.12, height * 0.085)
        : Math.min(width * 0.106, height * 0.19);
      const left = mobile ? width * 0.052 : width * 0.045;
      const secondLeft = mobile ? left : width * 0.09;
      const firstBaseline = mobile ? height * 0.48 : height * 0.46;
      const secondBaseline = firstBaseline + fontSize * 1.04;
      const lineOne = "好きなものを、";
      const lineTwo = "つくって試す。";

      context.font = `900 ${fontSize}px "Noto Sans JP", sans-serif`;
      const morph = smoothstep(progress / 0.78);
      const zoom = lerp(1, mobile ? 7.2 : 8.6, morph);
      const backgroundAlpha = smoothstep((progress - 0.48) / 0.42);
      const anchorX = width * (mobile ? 0.5 : 0.52);
      const anchorY = height * 0.5;

      const backgroundCanvas = document.createElement("canvas");
      backgroundCanvas.width = canvas.width;
      backgroundCanvas.height = canvas.height;
      const backgroundContext = backgroundCanvas.getContext("2d");
      backgroundContext.setTransform(density, 0, 0, density, 0, 0);
      backgroundContext.filter = `brightness(${lerp(1.55, 1, backgroundAlpha)}) saturate(1.1)`;
      drawImageCover(
        backgroundContext,
        imageRef.current,
        { x: 0, y: 0, width, height },
        0.54,
        0.47,
      );
      backgroundContext.filter = "none";

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskContext = maskCanvas.getContext("2d");
      maskContext.setTransform(density, 0, 0, density, 0, 0);
      maskContext.translate(anchorX, anchorY);
      maskContext.scale(zoom, zoom);
      maskContext.translate(-anchorX, -anchorY);
      maskContext.fillStyle = "#fff";
      maskContext.font = `900 ${fontSize}px "Noto Sans JP", sans-serif`;
      maskContext.textBaseline = "alphabetic";
      maskContext.fillText(lineOne, left, firstBaseline);
      maskContext.fillText(lineTwo, secondLeft, secondBaseline);

      const mediaCanvas = document.createElement("canvas");
      mediaCanvas.width = canvas.width;
      mediaCanvas.height = canvas.height;
      const mediaContext = mediaCanvas.getContext("2d");
      mediaContext.drawImage(backgroundCanvas, 0, 0);
      mediaContext.globalCompositeOperation = "destination-in";
      mediaContext.drawImage(maskCanvas, 0, 0);
      mediaContext.globalCompositeOperation = "source-atop";
      mediaContext.fillStyle = `rgba(255, 255, 255, ${lerp(0.32, 0, morph)})`;
      mediaContext.fillRect(0, 0, canvas.width, canvas.height);
      mediaContext.globalCompositeOperation = "source-over";

      if (backgroundAlpha > 0) {
        context.save();
        context.globalAlpha = backgroundAlpha;
        context.drawImage(backgroundCanvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
        context.restore();
      }

      context.save();
      context.globalAlpha = 1 - backgroundAlpha * 0.25;
      context.drawImage(mediaCanvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
      context.restore();

      if (morph < 0.34) {
        context.save();
        context.globalAlpha = (1 - morph / 0.34) * 0.62;
        context.translate(anchorX, anchorY);
        context.scale(zoom, zoom);
        context.translate(-anchorX, -anchorY);
        context.strokeStyle = "#f3f1eb";
        context.lineWidth = 1.2 / zoom;
        context.font = `900 ${fontSize}px "Noto Sans JP", sans-serif`;
        context.textBaseline = "alphabetic";
        context.strokeText(lineOne, left, firstBaseline);
        context.strokeText(lineTwo, secondLeft, secondBaseline);
        context.restore();
      }

      if (backgroundAlpha > 0.5) {
        context.fillStyle = `rgba(0, 0, 0, ${lerp(0, 0.28, (backgroundAlpha - 0.5) * 2)})`;
        context.fillRect(0, 0, width, height);
      }
    };

    document.fonts?.ready.then(draw);
    draw();
    window.addEventListener("resize", draw);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", draw);
    };
  }, [progress, ready]);

  return <canvas className="intro-media-canvas" ref={canvasRef} aria-hidden="true" />;
}

function Intro({ progress }) {
  return (
    <section className="intro-section" id="intro" aria-labelledby="intro-title">
      <div className="intro-stage">
        <IntroCanvas progress={progress} />
        <h1 className="intro-semantic-title" id="intro-title">
          好きなものを、つくって試す。
        </h1>
        <p className="intro-index">TOKYO / 35.6812° N</p>
        <div className="intro-byline">
          <span>TSUTSUMIN</span>
          <p>そこらへんの情報系大学生。</p>
        </div>
        <div className="scroll-cue">
          <span>SCROLL TO EXPAND</span>
          <ArrowDown size={17} />
        </div>
        <PageCount current={1} />
      </div>
    </section>
  );
}

function WorksOrbit({ selected, setSelected, onOpen }) {
  const fieldRef = useRef(null);
  const density =
    works.length <= 4 ? "density-large" : works.length <= 6 ? "density-medium" : "density-small";

  const moveField = (event) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    fieldRef.current.style.setProperty("--orbit-x", x.toFixed(3));
    fieldRef.current.style.setProperty("--orbit-y", y.toFixed(3));
  };

  return (
    <section className="viewport-section works-section" id="works" aria-labelledby="works-title">
      <div className="section-topline">
        <span>02 / SELECTED WORKS</span>
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
        onPointerLeave={() => {
          fieldRef.current?.style.setProperty("--orbit-x", 0);
          fieldRef.current?.style.setProperty("--orbit-y", 0);
        }}
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
      <PageCount current={2} />
    </section>
  );
}

function ProjectRail({ activeIndex, onNavigate }) {
  const previous = activeIndex > 0 ? works[activeIndex - 1] : null;
  const next = activeIndex < works.length - 1 ? works[activeIndex + 1] : null;

  return (
    <div className="project-rail">
      <button
        className="project-neighbor previous"
        type="button"
        disabled={!previous}
        onClick={() => previous && onNavigate(activeIndex - 1)}
      >
        <ArrowLeft size={24} weight="bold" />
        {previous ? (
          <>
            <img src={previous.image} alt="" />
            <span>
              <small>PREVIOUS</small>
              <strong>{previous.title}</strong>
            </span>
          </>
        ) : (
          <span>
            <small>START</small>
            <strong>First project</strong>
          </span>
        )}
      </button>

      <div className="project-progress" aria-live="polite">
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <div>
          {works.map((work, index) => (
            <button
              type="button"
              className={index === activeIndex ? "active" : ""}
              onClick={() => onNavigate(index)}
              aria-label={`${work.title}へ移動`}
              key={work.slug}
            />
          ))}
        </div>
        <span>{String(works.length).padStart(2, "0")}</span>
      </div>

      <button
        className="project-neighbor next"
        type="button"
        onClick={() => {
          if (next) onNavigate(activeIndex + 1);
          else document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {next ? (
          <>
            <span>
              <small>NEXT</small>
              <strong>{next.title}</strong>
            </span>
            <img src={next.image} alt="" />
          </>
        ) : (
          <span>
            <small>NEXT CHAPTER</small>
            <strong>About me</strong>
          </span>
        )}
        <ArrowRight size={24} weight="bold" />
      </button>
    </div>
  );
}

function ProjectHorizontal({ progress, activeIndex, onNavigate }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      const section = document.getElementById("project");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const active = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!active) return;
      if (event.key === "ArrowRight" && activeIndex < works.length - 1) {
        event.preventDefault();
        onNavigate(activeIndex + 1);
      }
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        event.preventDefault();
        onNavigate(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onNavigate]);

  return (
    <section
      className="project-scroll-section"
      id="project"
      aria-label="作品詳細"
      style={{ "--project-height": `${(works.length + 1) * 100}svh` }}
    >
      <div className="project-sticky">
        <div
          className="project-track"
          style={{ transform: `translate3d(${-progress * (works.length - 1) * 100}vw, 0, 0)` }}
        >
          {works.map((work, index) => (
            <article
              className="project-slide"
              id={`project-${work.slug}`}
              aria-labelledby={`project-title-${work.slug}`}
              key={work.slug}
            >
              <img
                className="project-backdrop"
                src={work.image}
                alt=""
                style={{ objectPosition: work.focus }}
              />
              <div className="project-scrim" aria-hidden="true" />
              <div className="project-meta">
                <span>03 / PROJECT FOCUS</span>
                <span>{work.year}</span>
                <span>{work.type}</span>
              </div>
              <div className="project-copy">
                <p>SELECTED WORK / 0{index + 1}</p>
                <h2 id={`project-title-${work.slug}`}>{work.title}</h2>
                <strong>{work.detailCopy}</strong>
                <a href={work.href} target="_blank" rel="noreferrer">
                  OPEN SITE <ArrowUpRight size={20} weight="bold" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <ProjectRail activeIndex={activeIndex} onNavigate={onNavigate} />
        <PageCount current={3} />
      </div>
    </section>
  );
}

function HobbyStrips() {
  const [lockedHobby, setLockedHobby] = useState(0);
  const [previewHobby, setPreviewHobby] = useState(null);
  const dragStart = useRef(null);
  const active = previewHobby ?? lockedHobby;

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
    <section className="viewport-section about-section" id="about" aria-labelledby="about-title">
      <div className="section-topline dark">
        <span>04 / OFF THE KEYBOARD</span>
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
            onClick={() => {
              setLockedHobby(index);
              setPreviewHobby(null);
            }}
            key={hobby.title}
            aria-pressed={lockedHobby === index}
          >
            <img src={hobby.image} alt={hobby.title} draggable="false" />
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
            onClick={() => {
              setLockedHobby(index);
              setPreviewHobby(null);
            }}
            key={hobby.title}
          >
            {hobby.label}
          </button>
        ))}
      </div>
      <PageCount current={4} dark />
    </section>
  );
}

function Affiliations() {
  const [active, setActive] = useState(0);

  return (
    <section
      className="viewport-section affiliations-section"
      id="affiliations"
      aria-labelledby="affiliations-title"
    >
      <div className="section-topline">
        <span>05 / COMMUNITY</span>
        <span>HOVER THE SIGNAL</span>
      </div>
      <h2 id="affiliations-title">
        ひとりでは、
        <br />
        つくれない。
      </h2>
      <div className="community-field">
        <div className="community-orbit" aria-hidden="true" />
        <div className="community-copy" aria-live="polite">
          <span>CONNECTED / 0{active + 1}</span>
          <strong>{affiliations[active].title}</strong>
          <p>{affiliations[active].description}</p>
        </div>
        {affiliations.map((item, index) => (
          <a
            className={
              index === active
                ? `community-node node-${index + 1} active`
                : `community-node node-${index + 1}`
            }
            href={item.href}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            key={item.title}
          >
            <img src={item.image} alt={`${item.title}のロゴ`} />
            <span>
              <small>AFFILIATION / 0{index + 1}</small>
              <strong>{item.title}</strong>
            </span>
            <ArrowUpRight size={22} weight="bold" />
          </a>
        ))}
      </div>
      <PageCount current={5} />
    </section>
  );
}

function Links() {
  return (
    <section className="viewport-section links-section" id="links" aria-labelledby="links-title">
      <div className="section-topline dark">
        <span>06 / FIND ME ONLINE</span>
        <span>TOKYO, JAPAN</span>
      </div>
      <div className="links-heading">
        <p>NEXT CONNECTION</p>
        <h2 id="links-title">
          また、
          <br />
          どこかで。
        </h2>
      </div>
      <div className="social-rows">
        {socialLinks.map((link, index) => (
          <a href={link.href} target="_blank" rel="noreferrer" key={link.title}>
            <span>0{index + 1}</span>
            <img src={link.image} alt="" />
            <strong>{link.title}</strong>
            <small>{link.handle}</small>
            <ArrowUpRight size={42} weight="bold" />
          </a>
        ))}
      </div>
      <div className="links-footer">
        <p>© 2026 TSUTSUMIN</p>
        <a href="https://me.tenelol.dev/" target="_blank" rel="noreferrer">
          FRIEND / MATSUDA <ArrowUpRight size={15} />
        </a>
        <a href="#intro">
          BACK TO TOP <ArrowDown className="upside" size={15} />
        </a>
      </div>
      <PageCount current={6} dark />
    </section>
  );
}

function WorkLaunch({ launch }) {
  if (!launch) return null;
  const work = works[launch.index];
  const frame = launch.open
    ? { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: 0 }
    : {
        top: launch.rect.top,
        left: launch.rect.left,
        width: launch.rect.width,
        height: launch.rect.height,
        borderRadius: 14,
      };

  return (
    <div className={launch.open ? "work-launch open" : "work-launch"} style={frame} aria-hidden="true">
      <img src={work.image} alt="" style={{ objectPosition: work.focus }} />
      <span>{work.title}</span>
    </div>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(1);
  const [heroProgress, setHeroProgress] = useState(0);
  const [projectProgress, setProjectProgress] = useState(1 / (works.length - 1));
  const [launch, setLaunch] = useState(null);
  const shellRef = useRef(null);
  const launchTimers = useRef([]);
  const active = useSectionTracking();

  const scrollToProject = useCallback((index, behavior = "smooth") => {
    const section = document.getElementById("project");
    if (!section) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      document.getElementById(`project-${works[index].slug}`)?.scrollIntoView({ behavior });
      return;
    }
    const range = Math.max(1, section.offsetHeight - window.innerHeight);
    const top = section.offsetTop + (index / (works.length - 1)) * range;
    window.scrollTo({ top, behavior });
  }, []);

  const launchProject = useCallback(
    (index, element) => {
      setSelectedWork(index);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const image = element?.querySelector(".node-image");
      if (!image || reducedMotion) {
        scrollToProject(index);
        return;
      }

      launchTimers.current.forEach(window.clearTimeout);
      const rect = image.getBoundingClientRect();
      setLaunch({ index, rect, open: false });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLaunch((current) => (current ? { ...current, open: true } : current));
        });
      });
      launchTimers.current = [
        window.setTimeout(() => scrollToProject(index, "instant"), 520),
        window.setTimeout(() => setLaunch(null), 760),
      ];
    },
    [scrollToProject],
  );

  useEffect(
    () => () => {
      launchTimers.current.forEach(window.clearTimeout);
    },
    [],
  );

  useEffect(() => {
    let frame = 0;
    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const intro = document.getElementById("intro");
        if (intro) {
          const rect = intro.getBoundingClientRect();
          const distance = Math.max(1, intro.offsetHeight - window.innerHeight);
          setHeroProgress(clamp(-rect.top / distance));
        }

        const project = document.getElementById("project");
        if (project && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const rect = project.getBoundingClientRect();
          const distance = Math.max(1, project.offsetHeight - window.innerHeight);
          const progress = clamp(-rect.top / distance);
          setProjectProgress(progress);
          const index = Math.round(progress * (works.length - 1));
          setSelectedWork((current) => (current === index ? current : index));
        }
      });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    const moveCursor = (event) => {
      shellRef.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
      shellRef.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", moveCursor, { passive: true });
    return () => window.removeEventListener("pointermove", moveCursor);
  }, []);

  return (
    <div className="site-shell" ref={shellRef}>
      <div className="cursor-aura" aria-hidden="true" />
      <SiteHeader
        active={active}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main>
        <Intro progress={heroProgress} />
        <WorksOrbit
          selected={selectedWork}
          setSelected={setSelectedWork}
          onOpen={launchProject}
        />
        <ProjectHorizontal
          progress={projectProgress}
          activeIndex={selectedWork}
          onNavigate={scrollToProject}
        />
        <HobbyStrips />
        <Affiliations />
        <Links />
      </main>
      <WorkLaunch launch={launch} />
    </div>
  );
}
