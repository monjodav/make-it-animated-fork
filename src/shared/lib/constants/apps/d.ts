import DiscordImage from "@/assets/images/apps/discord.png";
import { App } from "../apps-list";

export const discord: App = {
  name: "Discord",
  imageSource: DiscordImage,
  animations: [
    {
      name: "Custom switch animation",
      href: "/discord/clips",
    },
    {
      name: "Language radio button animation",
      href: "/discord/language",
    },
  ],
};
