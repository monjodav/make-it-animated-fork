import OpaltImage from "@/assets/images/apps/opal.png";
import { App } from "../apps-list";

export const opal: App = {
  name: "Opal",
  imageSource: OpaltImage,
  animations: [
    {
      name: "Start timer button animation",
      href: "/opal/home",
    },
    {
      name: "Moving dashed border animation",
      href: "/opal/blocks",
    },
  ],
};
