import SlackImage from "@/assets/images/apps/slack.png";
import ShowcaseImage from "@/assets/images/apps/showcase.png";
import { App } from "../apps-list";

export const slack: App = {
  name: "Slack",
  imageSource: SlackImage,
  animations: [
    {
      name: "Catch up cards swipe animation",
      href: "/slack/catch-up",
    },
    {
      name: "Catch up header counter animation",
      href: "/slack/catch-up",
    },
  ],
};

export const showcase: App = {
  name: "Showcase",
  imageSource: ShowcaseImage,
  animations: [
    {
      name: "Upcoming list scroll animation",
      href: "/showcase/upcoming",
    },
  ],
};
