import type { CSSProperties } from "react";

export interface ImageAsset {
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageWidths: number[];
}

export interface WorkCommon extends ImageAsset {
  slug: string;
  href: string;
  title: string;
  description: string;
  detailCopy: string;
  type: string;
  year: string;
  focus: string;
}

export type FeaturedWork = WorkCommon & {
  featured: true;
};

export type Work =
  | FeaturedWork
  | (WorkCommon & {
      featured: false;
      position?: never;
    });

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

export type WorkLaunchPhase = "captured" | "landing";

export interface WorkLaunchState {
  index: number;
  startRect: DOMRect;
  landingRect: DOMRect | null;
  startRadius: string;
  landingRadius: string;
  phase: WorkLaunchPhase;
}

export type CSSVariables = CSSProperties & Record<`--${string}`, string | number>;
