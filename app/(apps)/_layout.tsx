import { HomeAnchorButton } from "@/src/shared/components/home-anchor-button";
import { Slot } from "expo-router";

const DEV_HREF = process.env.EXPO_PUBLIC_DEV_HREF;

export default function AppsLayout() {
  if (__DEV__ && DEV_HREF !== "unset") {
    return <Slot />;
  }

  return (
    <>
      <Slot />
      <HomeAnchorButton />
    </>
  );
}
