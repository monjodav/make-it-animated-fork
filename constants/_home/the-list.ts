import { Href } from "expo-router";
import { appleBooks, appleInvites } from "./apps/a";
import { colorsApp } from "./apps/c";
import { instagram } from "./apps/i";
import { linear, linkedin, luma } from "./apps/l";
import { pinterest } from "./apps/p";
import { x } from "./apps/x";
import { viber } from "./apps/v";
import { whatsapp } from "./apps/w";
import { github, googleChrome } from "./apps/g";

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
  appleInvites,
  // B
  // C
  colorsApp,
  // D
  // E
  // F
  // G
  googleChrome,
  github,
  // H
  // I
  instagram,
  // J
  // K
  // L
  linear,
  linkedin,
  luma,
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
  viber,
  // W
  whatsapp,
  // X
  x,
  // Y
  // Z
];
