import ColorsAppImage from "@/assets/images/apps/colors-app.png";
import CanvaImage from "@/assets/images/apps/canva.png";
import { App } from "../the-list";

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
  name: "Colors App",
  imageSource: ColorsAppImage,
  animations: [
    {
      name: "Color picker background animation",
      href: "/colors-app/color-picker",
    },
    {
      name: "Palette picker color change animation",
      href: "/colors-app/palette-picker",
    },
    {
      name: "Home header animation",
      href: "/colors-app/home",
    },
    {
      name: "Card blurry circles animation",
      href: "/colors-app/home",
    },
  ],
};
