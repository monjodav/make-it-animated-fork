import ColorsAppImage from "@/assets/images/apps/colors-app.png";
import CanvaImage from "@/assets/images/apps/canva.png";
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
