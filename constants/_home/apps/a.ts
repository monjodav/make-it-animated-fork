import AppleBooksImage from "@/assets/images/apps/apple-books.png";
import AppleInvitesImage from "@/assets/images/apps/apple-invites.png";
import { App } from "../the-list";

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
