import InstagramImage from "@/assets/images/apps/instagram.png";
import { App } from "../apps-list";

export const instagram: App = {
  name: "Instagram",
  imageSource: InstagramImage,
  animations: [
    {
      name: "Story controls animation",
      href: "/instagram/story",
    },
  ],
};
