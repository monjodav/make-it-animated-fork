import InstagramImage from "@/assets/images/apps/instagram.png";
import { App } from "../apps-list";

export const instagram: App = {
  name: "Instagram",
  imageSource: InstagramImage,
  animations: [
    {
      name: "Header on scroll animation",
      href: "/instagram/home",
    },
    {
      name: "Pagination dots animation",
      href: "/instagram/home",
    },
    {
      name: "Story controls animation",
      href: "/instagram/add-content",
    },
  ],
};
