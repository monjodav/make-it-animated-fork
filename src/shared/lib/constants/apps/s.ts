import SlackImage from "@/assets/images/apps/slack.png";
import { App } from "../apps-list";

export const slack: App = {
  name: "Slack",
  imageSource: SlackImage,
  animations: [
    {
      name: "Catch up cards swipe animation",
      href: "/slack/home",
    },
  ],
};
