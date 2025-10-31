import { Href } from "expo-router";
import { adidas, alma, appleBooks, appleInvites, appStore } from "./apps/a";
import { canva, colorsApp, chatgpt } from "./apps/c";
import { instagram } from "./apps/i";
import { linear, linkedin, luma } from "./apps/l";
import { perplexity, pinterest } from "./apps/p";
import { x } from "./apps/x";
import { viber } from "./apps/v";
import { whatsapp } from "./apps/w";
import { github, gmail, googleChrome, grok } from "./apps/g";
import { queue } from "./apps/q";
import { threads } from "./apps/t";
import { fuse } from "./apps/f";
import { raycast } from "./apps/r";
import { shopify, showcase, slack, superlist } from "./apps/s";
import { discord } from "./apps/d";
import { opal } from "./apps/o";

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
  alma,
  appleBooks,
  appleInvites,
  appStore,
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
  opal,
  //------------------------
  // P
  perplexity,
  pinterest,
  // Q
  queue,
  // R
  raycast,
  // -----------------------
  // S
  shopify,
  slack,
  showcase,
  superlist,
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
