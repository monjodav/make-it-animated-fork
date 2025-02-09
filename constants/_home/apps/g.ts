import GoogleChromeImage from "@/assets/images/apps/google-chrome.png";
import { App } from "../the-list";

export const googleChrome: App = {
  name: "Google Chrome",
  imageSource: GoogleChromeImage,
  animations: [
    {
      name: "Top tabs indicator animation",
      href: "/google-chrome/tabs",
    },
  ],
};
