import ViberImage from "@/assets/images/apps/viber.png";
import { App } from "../apps-list";

export const viber: App = {
  name: "Viber",
  imageSource: ViberImage,
  animations: [
    {
      name: "Chats header animation",
      href: "/viber/chats",
    },
    {
      name: "Header large title animation",
      href: "/viber/calls",
    },
    {
      name: "Calls top tabs animation",
      href: "/viber/calls",
    },
  ],
};
