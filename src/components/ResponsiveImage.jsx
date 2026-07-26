function getOptimizedPath(src, width, format) {
  const filename = src.split("/").pop();
  const stem = filename?.replace(/\.[^.]+$/, "");
  return `/images/optimized/${stem}-${width}.${format}`;
}

function getSrcSet(src, widths, format) {
  return widths
    .map((width) => `${getOptimizedPath(src, width, format)} ${width}w`)
    .join(", ");
}

export function ResponsiveImage({
  src,
  width,
  height,
  widths = [],
  sizes = "100vw",
  loading = "lazy",
  decoding = "async",
  ...props
}) {
  if (!widths.length) {
    return (
      <img
        src={src}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        {...props}
      />
    );
  }

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={getSrcSet(src, widths, "avif")}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={getSrcSet(src, widths, "webp")}
        sizes={sizes}
      />
      <img
        src={src}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        sizes={sizes}
        {...props}
      />
    </picture>
  );
}
