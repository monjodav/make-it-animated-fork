import PinterestImage from "@/assets/images/apps/pinterest.png";
import PerplexityImage from "@/assets/images/apps/perplexity.png";
import { App } from "../apps-list";

export const pinterest: App = {
  name: "Pinterest",
  imageSource: PinterestImage,
  animations: [
    {
      name: "Navigation between boards animation",
      href: "/pinterest/home",
    },
    {
      name: "Pull to refresh loading animation",
      href: "/pinterest/home",
    },
  ],
};

export const perplexity: App = {
  name: "Perplexity",
  imageSource: PerplexityImage,
  animations: [
    {
      name: "Home screen animation",
      href: "/perplexity/home",
    },
  ],
};
