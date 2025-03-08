import ThreadsImage from "@/assets/images/apps/threads.png";
import { App } from "../the-list";

export const threads: App = {
  name: "Threads",
  imageSource: ThreadsImage,
  animations: [
    {
      name: "Profile picture animation",
      href: "/threads/profile",
    },
  ],
};
