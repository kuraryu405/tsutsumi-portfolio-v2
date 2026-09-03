import { sections } from "../data/portfolio";

interface PageCountProps {
  current: number;
  dark?: boolean;
}

export function PageCount({ current, dark = false }: PageCountProps) {
  return (
    <p className={dark ? "page-count dark" : "page-count"}>
      <span>{String(current).padStart(2, "0")}</span>
      <i />
      {String(sections.length).padStart(2, "0")}
    </p>
  );
}
