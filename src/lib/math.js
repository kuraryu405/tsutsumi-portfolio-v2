export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const lerp = (from, to, amount) => from + (to - from) * amount;

export const smoothstep = (value) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};

