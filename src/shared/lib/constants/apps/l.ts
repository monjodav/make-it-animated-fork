import LinearImage from "@/assets/images/apps/linear.png";
import LinkedinImage from "@/assets/images/apps/linkedin.png";
import LumaImage from "@/assets/images/apps/luma.png";
import LongevityImage from "@/assets/images/apps/longevity.png";
import { App } from "../apps-list";

export const linear: App = {
  name: "Linear",
  imageSource: LinearImage,
  animations: [
    {
      name: "Button tabs indicator animation",
      href: "/linear/home/dev-issues",
    },
    {
      name: "Header on scroll animation",
      href: "/linear/inbox",
    },
    {
      name: "Search screen open close animation",
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

export const longevity: App = {
  name: "Longevity",
  imageSource: LongevityImage,
  animations: [
    {
      name: "Onboarding flow animation",
      href: "/longevity/onboarding",
    },
  ],
};
