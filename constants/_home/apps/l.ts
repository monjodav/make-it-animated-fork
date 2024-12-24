import LinkedinImage from "@/assets/images/apps/linkedin.png";
import LinearImage from "@/assets/images/apps/linear.png";
import { App } from "../the-list";

export const linear: App = {
  name: "Linear",
  imageSource: LinearImage,
  animations: [
    {
      name: "Button tabs indicator animation",
      href: "/linear/home",
    },
  ],
};

export const linkedin: App = {
  name: "Linkedin",
  imageSource: LinkedinImage,
  animations: [
    {
      name: "Bottom tabs indicator animation",
      href: "/linkedin/home",
    },
  ],
};
