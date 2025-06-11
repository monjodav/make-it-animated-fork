import ColorsAppImage from "@/assets/images/apps/colors-app.png";
import CanvaImage from "@/assets/images/apps/canva.png";
import ChatGPTImage from "@/assets/images/apps/chatgpt.png";
import { App } from "../apps-list";

export const canva: App = {
  name: "Canva",
  imageSource: CanvaImage,
  animations: [
    {
      name: "Header transition animation",
      href: "/canva/projects",
    },
  ],
};

export const chatgpt: App = {
  name: "ChatGPT",
  imageSource: ChatGPTImage,
  animations: [
    {
      name: "Shimmer text animation",
      href: "/chatgpt/chat",
    },
  ],
};

export const colorsApp: App = {
  name: "ColorsApp",
  imageSource: ColorsAppImage,
  animations: [
    {
      name: "Color picker background animation",
      href: "/colorsapp/color-picker",
    },
    {
      name: "Palette picker color change animation",
      href: "/colorsapp/palette-picker",
    },
    {
      name: "Home header animation",
      href: "/colorsapp/home",
    },
    {
      name: "Card blurry circles animation",
      href: "/colorsapp/home",
    },
  ],
};
