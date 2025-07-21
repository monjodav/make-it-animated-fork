import GoogleChromeImage from "@/assets/images/apps/google-chrome.png";
import GmailImage from "@/assets/images/apps/gmail.png";
import GithubImage from "@/assets/images/apps/github.png";
import GrokImage from "@/assets/images/apps/grok.png";
import { App } from "../apps-list";

export const googleChrome: App = {
  name: "Google Chrome",
  imageSource: GoogleChromeImage,
  animations: [
    {
      name: "Top tabs indicator animation",
      href: "/google-chrome/tabs",
    },
    {
      name: "Header background animation",
      href: "/google-chrome/tabs",
    },
    {
      name: "Footer animation",
      href: "/google-chrome/tabs",
    },
    {
      name: "Tab item layout animation",
      href: "/google-chrome/tabs",
    },
  ],
};

export const gmail: App = {
  name: "Gmail",
  imageSource: GmailImage,
  animations: [
    {
      name: "Header scroll animation",
      href: "/gmail/inbox",
    },
    {
      name: "Bottom tab bar and FAB animation",
      href: "/gmail/inbox",
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
    {
      name: "Achievements carousel animation",
      href: "/github/achievements",
    },
  ],
};

export const grok: App = {
  name: "Grok",
  imageSource: GrokImage,
  animations: [
    {
      name: "Attach file menu animation",
      href: "/grok/chat",
    },
  ],
};
