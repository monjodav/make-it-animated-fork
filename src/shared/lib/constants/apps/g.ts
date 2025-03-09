import GoogleChromeImage from "@/assets/images/apps/google-chrome.png";
import GithubImage from "@/assets/images/apps/github.png";
import { App } from "../apps-list";

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

export const github: App = {
  name: "Github",
  imageSource: GithubImage,
  animations: [
    {
      name: "Profile header title animation",
      href: "/github/profile",
    },
  ],
};
