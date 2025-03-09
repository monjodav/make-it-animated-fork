import XImage from "@/assets/images/apps/x.png";
import { App } from "../apps-list";

export const x: App = {
  name: "X",
  imageSource: XImage,
  animations: [
    {
      name: "Bottom tabs background animation",
      href: "/x/home",
    },
    {
      name: "Floating action button animation",
      href: "/x/home",
    },
    {
      name: "Home header animation",
      href: "/x/home",
    },
    {
      name: "Top tabs indicator animation",
      href: "/x/home",
    },
  ],
};
