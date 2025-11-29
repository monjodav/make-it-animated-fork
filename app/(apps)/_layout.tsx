import { HomeAnchorButton } from "@/src/shared/components/home-anchor-button";
import { Slot } from "expo-router";

export default function AppsLayout() {
  return (
    <>
      <Slot />
      <HomeAnchorButton />
    </>
  );
}
