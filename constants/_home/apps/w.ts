import WhatsappImage from "@/assets/images/apps/whatsapp.png";
import { App } from "../the-list";

export const whatsapp: App = {
  name: "Whatsapp",
  imageSource: WhatsappImage,
  animations: [
    {
      name: "Updates screen header animation",
      href: "/whatsapp/updates",
    },
    {
      name: "Add status background animation",
      href: "/whatsapp/updates",
    },
    {
      name: "Header large title animation",
      href: "/whatsapp/communities",
    },
  ],
};
