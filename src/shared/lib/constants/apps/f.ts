import FuseImage from "@/assets/images/apps/fuse.png";
import { App } from "../apps-list";

export const fuse: App = {
  name: "Fuse",
  imageSource: FuseImage,
  animations: [
    {
      name: "Home tabs transition animation",
      href: "/fuse/home",
    },
    {
      name: "Balance secure view toggle animation",
      href: "/fuse/home",
    },
    {
      name: "Balance change toggle animation",
      href: "/fuse/home",
    },
    {
      name: "Info cards carousel animation",
      href: "/fuse/home",
    },
  ],
};
