import AdidasImage from "@/assets/images/apps/adidas.png";
import AppleBooksImage from "@/assets/images/apps/apple-books.png";
import AppleInvitesImage from "@/assets/images/apps/apple-invites.png";
import { App } from "../apps-list";

export const adidas: App = {
  name: "Adidas",
  imageSource: AdidasImage,
  animations: [
    {
      name: "Home header marquee animation",
      href: "/adidas/home",
    },
  ],
};

export const appleBooks: App = {
  name: "Apple Books",
  imageSource: AppleBooksImage,
  animations: [
    {
      name: "Menu buttons animation",
      href: "/apple-books/book",
    },
  ],
};

export const appleInvites: App = {
  name: "Apple Invites",
  imageSource: AppleInvitesImage,
  animations: [
    {
      name: "Welcome screen animation",
      href: "/apple-invites/welcome",
    },
  ],
};
