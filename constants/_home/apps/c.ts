import ColorsAppImage from "@/assets/images/apps/colors-app.png";
import { App } from "../the-list";

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
  ],
};
