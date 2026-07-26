import { useEffect, useRef } from "react";
import { ArrowDown } from "@phosphor-icons/react";
import { PageCount } from "../components/PageCount";
import { clamp, lerp, smoothstep } from "../lib/math";

const HERO_SOURCES = {
  mobile: "/images/optimized/pc-960.webp",
  tablet: "/images/optimized/pc-1600.webp",
  desktop: "/images/optimized/pc-2048.webp",
};

const HERO_COPY = {
  first: "Beyond the period,",
  second: "a future yet unseen.",
  full: "Beyond the period, a future yet unseen.",
};

function getHeroSource() {
  if (window.innerWidth <= 600) return HERO_SOURCES.mobile;
  if (window.innerWidth <= 1200) return HERO_SOURCES.tablet;
  return HERO_SOURCES.desktop;
}

const VERTEX_SHADER_SOURCE = `#version 300 es
  in vec2 aPosition;
  out vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
  precision highp float;

  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uImage;
  uniform sampler2D uMask;
  uniform vec4 uCrop;
  uniform vec2 uAnchor;
  uniform vec2 uTexel;
  uniform float uZoom;
  uniform float uMorph;
  uniform float uBackgroundAlpha;
  uniform float uBrightness;

  vec3 sampleImage(vec2 uv) {
    vec2 imageUv = uCrop.xy + uv * uCrop.zw;
    vec3 color = texture(uImage, imageUv).rgb;
    float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(luminance), color, 1.1) * uBrightness;
  }

  float sampleMask(vec2 uv) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      return 0.0;
    }
    return texture(uMask, uv).a;
  }

  void main() {
    vec3 imageColor = sampleImage(vUv);
    vec2 maskUv = uAnchor + (vUv - uAnchor) / uZoom;
    float mask = sampleMask(maskUv);
    float tint = mix(0.32, 0.0, uMorph);
    vec3 maskedImage = mix(imageColor, vec3(1.0), tint);

    vec3 color = mix(vec3(0.035), imageColor, uBackgroundAlpha);
    float mediaAlpha = mask * (1.0 - uBackgroundAlpha * 0.25);
    color = mix(color, maskedImage, mediaAlpha);

    if (uMorph < 0.34) {
      vec2 edgeStep = uTexel / uZoom * 1.35;
      float expanded = mask;
      expanded = max(expanded, sampleMask(maskUv + vec2(edgeStep.x, 0.0)));
      expanded = max(expanded, sampleMask(maskUv - vec2(edgeStep.x, 0.0)));
      expanded = max(expanded, sampleMask(maskUv + vec2(0.0, edgeStep.y)));
      expanded = max(expanded, sampleMask(maskUv - vec2(0.0, edgeStep.y)));
      float outline = max(0.0, expanded - mask);
      float outlineAlpha = outline * (1.0 - uMorph / 0.34) * 0.62;
      color = mix(color, vec3(0.953, 0.945, 0.922), outlineAlpha);
    }

    if (uBackgroundAlpha > 0.5) {
      float shade = mix(0.0, 0.28, (uBackgroundAlpha - 0.5) * 2.0);
      color = mix(color, vec3(0.0), shade);
    }

    outColor = vec4(color, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "Hero shader compilation failed.");
  }

  return shader;
}

function createHeroProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(message || "Hero shader linking failed.");
  }

  return program;
}

function IntroCanvas({ onSettled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const image = new Image();
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d");
    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    const media = canvas.closest(".intro-media");

    if (!gl || !maskContext) {
      media?.classList.add("webgl-failed");
      onSettled?.("fallback");
      return undefined;
    }

    let frame = 0;
    let ready = false;
    let cancelled = false;
    let lastProgress = -1;
    let lastWidth = 0;
    let lastHeight = 0;
    let lastDensity = 0;
    let program;
    let positionBuffer;
    let imageTexture;
    let maskTexture;
    let uniforms;
    let didSettle = false;

    const settle = (mode) => {
      if (cancelled || didSettle) return;
      didSettle = true;
      onSettled?.(mode);
    };

    const useFallback = (imageFailed = false) => {
      media?.classList.add("webgl-failed");
      if (imageFailed) media?.classList.add("hero-image-failed");
      settle("fallback");
    };

    const uploadTexture = (texture, source) => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    };

    const updateCrop = (width, height) => {
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const sourceWidth = width / scale;
      const sourceHeight = height / scale;
      const sourceX = clamp(
        image.naturalWidth * 0.54 - sourceWidth / 2,
        0,
        image.naturalWidth - sourceWidth,
      );
      const sourceY = clamp(
        image.naturalHeight * 0.47 - sourceHeight / 2,
        0,
        image.naturalHeight - sourceHeight,
      );

      gl.uniform4f(
        uniforms.crop,
        sourceX / image.naturalWidth,
        1 - (sourceY + sourceHeight) / image.naturalHeight,
        sourceWidth / image.naturalWidth,
        sourceHeight / image.naturalHeight,
      );
    };

    const sizeSurfaces = (width, height, density) => {
      if (width === lastWidth && height === lastHeight && density === lastDensity) return;

      const pixelWidth = Math.round(width * density);
      const pixelHeight = Math.round(height * density);
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      maskCanvas.width = pixelWidth;
      maskCanvas.height = pixelHeight;
      gl.viewport(0, 0, pixelWidth, pixelHeight);

      const mobile = width <= 760;
      let fontSize = mobile
        ? Math.min(width * 0.105, height * 0.072)
        : Math.min(width * 0.078, height * 0.145);
      const left = mobile ? width * 0.052 : width * 0.045;
      const secondLeft = mobile ? width * 0.1 : width * 0.12;
      const firstBaseline = mobile ? height * 0.48 : height * 0.455;

      maskContext.setTransform(density, 0, 0, density, 0, 0);
      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#fff";
      maskContext.font = `900 ${fontSize}px "Noto Sans JP", sans-serif`;
      const longestLineWidth = Math.max(
        maskContext.measureText(HERO_COPY.first).width + left,
        maskContext.measureText(HERO_COPY.second).width + secondLeft,
      );
      if (longestLineWidth > width * 0.96) {
        fontSize *= (width * 0.96) / longestLineWidth;
        maskContext.font = `900 ${fontSize}px "Noto Sans JP", sans-serif`;
      }
      const secondBaseline = firstBaseline + fontSize * 1.08;
      maskContext.textBaseline = "alphabetic";
      maskContext.fillText(HERO_COPY.first, left, firstBaseline);
      maskContext.fillText(HERO_COPY.second, secondLeft, secondBaseline);

      const periodWordStart =
        left + maskContext.measureText("Beyond the ").width;
      const periodWordEnd =
        periodWordStart + maskContext.measureText("period").width;
      const finalPeriodX =
        secondLeft + maskContext.measureText(HERO_COPY.second).width;
      const linkY = firstBaseline + fontSize * 0.16;
      const finalPeriodY = secondBaseline + fontSize * 0.08;

      maskContext.beginPath();
      maskContext.moveTo(periodWordStart, linkY);
      maskContext.lineTo(periodWordEnd, linkY);
      maskContext.lineTo(finalPeriodX, finalPeriodY);
      maskContext.lineWidth = Math.max(1.5, fontSize * 0.022);
      maskContext.lineCap = "round";
      maskContext.lineJoin = "round";
      maskContext.strokeStyle = "#fff";
      maskContext.stroke();
      maskContext.beginPath();
      maskContext.arc(
        finalPeriodX,
        finalPeriodY,
        Math.max(2.5, fontSize * 0.035),
        0,
        Math.PI * 2,
      );
      maskContext.fill();

      gl.activeTexture(gl.TEXTURE1);
      uploadTexture(maskTexture, maskCanvas);
      gl.uniform2f(uniforms.texel, 1 / pixelWidth, 1 / pixelHeight);
      gl.uniform2f(uniforms.anchor, mobile ? 0.5 : 0.52, 0.5);
      updateCrop(width, height);

      lastWidth = width;
      lastHeight = height;
      lastDensity = density;
      lastProgress = -1;
    };

    const draw = (progress) => {
      if (cancelled || !ready) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const density = Math.min(window.devicePixelRatio || 1, 1.25);
      sizeSurfaces(width, height, density);

      if (Math.abs(progress - lastProgress) < 0.0015) return;
      lastProgress = progress;

      const mobile = width <= 760;
      const morph = smoothstep(progress / 0.78);
      const zoom = lerp(1, mobile ? 7.2 : 8.6, morph);
      const backgroundAlpha = smoothstep((progress - 0.48) / 0.42);

      gl.uniform1f(uniforms.zoom, zoom);
      gl.uniform1f(uniforms.morph, morph);
      gl.uniform1f(uniforms.backgroundAlpha, backgroundAlpha);
      gl.uniform1f(uniforms.brightness, lerp(1.55, 1, backgroundAlpha));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const update = () => {
      frame = 0;
      const intro = document.getElementById("intro");
      if (!intro) return;

      const rect = intro.getBoundingClientRect();
      const distance = Math.max(1, intro.offsetHeight - window.innerHeight);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      draw(reducedMotion ? 0 : clamp(-rect.top / distance));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const heroFontReady = document.fonts?.load(
      '900 64px "Noto Sans JP"',
      HERO_COPY.full,
    ) ?? Promise.resolve();

    image.decoding = "async";
    image.fetchPriority = "high";
    image.src = getHeroSource();
    image.onload = async () => {
      try {
        program = createHeroProgram(gl);
        positionBuffer = gl.createBuffer();
        imageTexture = gl.createTexture();
        maskTexture = gl.createTexture();
        uniforms = {
          crop: gl.getUniformLocation(program, "uCrop"),
          anchor: gl.getUniformLocation(program, "uAnchor"),
          texel: gl.getUniformLocation(program, "uTexel"),
          zoom: gl.getUniformLocation(program, "uZoom"),
          morph: gl.getUniformLocation(program, "uMorph"),
          backgroundAlpha: gl.getUniformLocation(program, "uBackgroundAlpha"),
          brightness: gl.getUniformLocation(program, "uBrightness"),
        };

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          gl.STATIC_DRAW,
        );
        const position = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        uploadTexture(imageTexture, image);
        gl.uniform1i(gl.getUniformLocation(program, "uImage"), 0);
        gl.uniform1i(gl.getUniformLocation(program, "uMask"), 1);

        await heroFontReady;
        if (cancelled) return;

        ready = true;
        media?.classList.add("webgl-ready");
        update();
        settle("ready");
      } catch (error) {
        console.warn("The accelerated hero could not start.", error);
        useFallback();
      }
    };
    image.onerror = () => useFallback(true);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      image.onload = null;
      image.onerror = null;
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (imageTexture) gl.deleteTexture(imageTexture);
      if (maskTexture) gl.deleteTexture(maskTexture);
      if (program) gl.deleteProgram(program);
    };
  }, [onSettled]);

  return (
    <div className="intro-media" aria-hidden="true">
      <canvas className="intro-media-canvas" ref={canvasRef} />
      <div className="intro-media-fallback">
        <span>
          Beyond the <em>period</em>,
        </span>
        <span>
          a future yet unseen<span className="period-mark">.</span>
        </span>
      </div>
    </div>
  );
}

export function IntroSection({ onSettled }) {
  return (
    <section className="intro-section" id="intro" aria-labelledby="intro-title">
      <div className="intro-stage">
        <IntroCanvas onSettled={onSettled} />
        <h1 className="intro-semantic-title" id="intro-title">
          {HERO_COPY.full}
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
