import type { CSSProperties } from "react";

export interface ImageAsset {
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageWidths: number[];
}

export interface Work extends ImageAsset {
  slug: string;
  href: string;
  title: string;
  description: string;
  detailCopy: string;
  type: string;
  year: string;
  position: [string, string];
  focus: string;
}

export interface Hobby extends ImageAsset {
  title: string;
  label: string;
  text: string;
}

export interface Affiliation extends ImageAsset {
  id: string;
  href: string;
  title: string;
  description: string;
}

export type FriendOrbit =
  | { type: "affiliation"; id: string }
  | { type: "system" };

export interface MutualLink extends ImageAsset {
  id: string;
  orbit: FriendOrbit;
  href: string;
  external?: boolean;
  title: string;
  relationship: string;
  ariaLabel?: string;
}

export interface SocialLink extends ImageAsset {
  href: string;
  title: string;
  handle: string;
}

export type SectionNavigationItem = [id: string, label: string];

export type ProjectScrollBehavior = ScrollBehavior | "instant";

export interface WorkLaunchState {
  index: number;
  rect: DOMRect;
  open: boolean;
}

export type CSSVariables = CSSProperties & Record<`--${string}`, string | number>;
