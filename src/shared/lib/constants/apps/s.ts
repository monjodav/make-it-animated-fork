import ShopifyImage from "@/assets/images/apps/shopify.png";
import SlackImage from "@/assets/images/apps/slack.png";
import ShowcaseImage from "@/assets/images/apps/showcase.png";
import SuperlistImage from "@/assets/images/apps/superlist.png";
import { App } from "../apps-list";

export const shopify: App = {
  name: "Shopify",
  imageSource: ShopifyImage,
  animations: [
    {
      name: "Search screen top tabs animation",
      href: "/shopify/search",
    },
    {
      name: "Custom bottom tab bar animation",
      href: "/shopify/home",
    },
    {
      name: "Menu transition animation",
      href: "/shopify/products",
    },
    {
      name: "Tabs shared header animation",
      href: "/shopify/home",
    },
  ],
};

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

export const superlist: App = {
  name: "Superlist",
  imageSource: SuperlistImage,
  animations: [
    {
      name: "Onboarding animation",
      href: "/superlist/onboarding",
    },
  ],
};
