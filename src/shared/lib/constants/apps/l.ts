import LinearImage from "@/assets/images/apps/linear.png";
import LinkedinImage from "@/assets/images/apps/linkedin.png";
import LumaImage from "@/assets/images/apps/luma.png";
import { App } from "../apps-list";

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
    {
      name: "Header on scroll animation",
      href: "/linkedin/home",
    },
  ],
};

export const luma: App = {
  name: "Luma",
  imageSource: LumaImage,
  animations: [
    {
      name: "Discover city",
      href: "/luma/discover-city",
    },
  ],
};
