import { Href } from "expo-router";
import { appleBooks } from "./apps/a";
import { colorsApp } from "./apps/c";
import { instagram } from "./apps/i";
import { linear, linkedin } from "./apps/l";
import { pinterest } from "./apps/p";
import { x } from "./apps/x";

type Animation = {
  name: string;
  href: Href;
};

export type App = {
  name: string;
  imageSource: number;
  animations: Animation[];
};

// Apps A to Z
export const apps: App[] = [
  // A
  appleBooks,
  // B
  // C
  colorsApp,
  // D
  // E
  // F
  // G
  // H
  // I
  instagram,
  // J
  // K
  // L
  linear,
  linkedin,
  // M
  // N
  // O
  // P
  pinterest,
  // Q
  // R
  // S
  // T
  // U
  // V
  // W
  // X
  x,
  // Y
  // Z
];
