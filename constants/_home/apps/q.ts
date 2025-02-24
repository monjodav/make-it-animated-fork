import QueueImage from "@/assets/images/apps/queue.png";
import { App } from "../the-list";

export const queue: App = {
  name: "Queue",
  imageSource: QueueImage,
  animations: [
    {
      name: "Custom switch animation",
      href: "/queue/preferences",
    },
  ],
};
