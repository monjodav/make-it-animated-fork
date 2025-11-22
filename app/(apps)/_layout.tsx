import { DrawerToggleButton } from "@/src/shared/components/drawer-toggle-button";
import { Slot } from "expo-router";

export default function AppsLayout() {
  return (
    <>
      <Slot />
      {/* VS ------------ */}
      {/* <DrawerToggleButton /> */}
    </>
  );
}
