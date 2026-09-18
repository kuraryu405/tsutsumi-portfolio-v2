export function getOrbitPosition(index: number, total: number): [number, number] {
  if (total <= 1) return [50, 46];
  const angle = ((-90 - 180 / total + index * 360 / total) * Math.PI) / 180;
  return [50 + 34 * Math.cos(angle), 50 + 36 * Math.sin(angle)];
}

// Reserve room for the active image's 1.08x scale and the labels below it.
export function getOrbitCardWidth(total: number, width: number, height: number) {
  const caption = total >= 6 ? 0 : 80;
  const scale = 1.08;
  const gap = 12;
  const points = Array.from({ length: total }, (_, index) => {
    const [x, y] = getOrbitPosition(index, total);
    return [width * x / 100, height * y / 100];
  });
  let limit = total <= 4 ? 300 : total <= 8 ? 240 : 190;

  points.forEach(([x, y], index) => {
    limit = Math.min(
      limit,
      2 * (Math.min(x, width - x) - 20) / scale,
      (2 * Math.min(y, height - y + 40) - caption) * 1.6 / scale,
    );
    points.slice(index + 1).forEach(([otherX, otherY]) => {
      limit = Math.min(limit, Math.max(
        (Math.abs(x - otherX) - gap) / scale,
        (Math.abs(y - otherY) - caption - gap) * 1.6 / scale,
      ));
    });
  });
  return Math.max(1, Math.floor(limit));
}
