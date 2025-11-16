import OpalImage from "@/assets/images/apps/opal.png";
import { App } from "../apps-list";

export const opal: App = {
  name: "Opal",
  imageSource: OpalImage,
  animations: [
    {
      name: "Start timer button animation",
      href: "/opal/home",
    },
    {
      name: "Horizontal carousel animation",
      href: "/opal/blocks",
    },
    {
      name: "Schedule timer tabs transition animation",
      href: "/opal/schedule",
    },
    {
      name: "Set timer slider animation",
      href: "/opal/home",
    },
  ],
};
