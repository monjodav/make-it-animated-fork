import { Href } from "expo-router";
import { adidas, appleBooks, appleInvites } from "./apps/a";
import { canva, colorsApp, chatgpt } from "./apps/c";
import { instagram } from "./apps/i";
import { linear, linkedin, luma } from "./apps/l";
import { pinterest } from "./apps/p";
import { x } from "./apps/x";
import { viber } from "./apps/v";
import { whatsapp } from "./apps/w";
import { github, gmail, googleChrome, grok } from "./apps/g";
import { queue } from "./apps/q";
import { threads } from "./apps/t";
import { fuse } from "./apps/f";
import { raycast } from "./apps/r";
import { showcase, slack } from "./apps/s";
import { discord } from "./apps/d";

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
  adidas,
  appleBooks,
  appleInvites,
  // B
  // C
  canva,
  chatgpt,
  colorsApp,
  //------------------------
  // D
  discord,
  // E
  // F
  fuse,
  //------------------------
  // G
  github,
  googleChrome,
  gmail,
  grok,
  // H
  // I
  instagram,
  //------------------------
  // J
  // K
  // L
  linear,
  linkedin,
  luma,
  //------------------------
  // M
  // N
  // O
  //------------------------
  // P
  pinterest,
  // Q
  queue,
  // R
  raycast,
  // -----------------------
  // S
  slack,
  showcase,
  // T
  threads,
  //------------------------
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
