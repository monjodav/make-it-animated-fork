import RaycastImage from "@/assets/images/apps/raycast.png";
import { App } from "../apps-list";

export const raycast: App = {
  name: "Raycast",
  imageSource: RaycastImage,
  animations: [
    {
      name: "Home search transition animation",
      href: "/raycast/home",
    },
  ],
};
