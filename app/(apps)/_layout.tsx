import { HomeAnchorButton } from "@/src/shared/components/home-anchor-button";
import { Slot } from "expo-router";
import { DEV_HREF, SANDBOX } from "@/src/shared/lib/constants/dev";

export default function AppsLayout() {
  if (__DEV__ && (SANDBOX || DEV_HREF)) {
    return <Slot />;
  }

  return (
    <>
      <Slot />
      <HomeAnchorButton />
    </>
  );
}
