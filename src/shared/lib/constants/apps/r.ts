import RaycastImage from "@/assets/images/apps/raycast.png";
import RedditImage from "@/assets/images/apps/reddit.png";
import { App } from "../apps-list";

export const raycast: App = {
  name: "Raycast",
  imageSource: RaycastImage,
  animations: [
    {
      name: "Home search transition animation",
      href: "/raycast/home",
    },
    {
      name: "Paywall screen animation",
      href: "/raycast/paywall",
    },
  ],
};

export const reddit: App = {
  name: "Reddit",
  imageSource: RedditImage,
  animations: [
    {
      name: "Pull to refresh animation",
      href: "/reddit/home",
    },
  ],
};
