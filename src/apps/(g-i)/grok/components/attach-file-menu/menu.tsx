import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { MenuItems } from "./menu-items";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Backdrop } from "./backdrop";
import { Overlay } from "./overlay";
import { RecentPhotos } from "./recent-photos";

export const Menu: FC = () => {
  const { isMenuOpen } = useAttachFileMenu();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: isMenuOpen.get() ? "auto" : "none",
    };
  });

  return (
    <Animated.View className="justify-end px-8" style={[StyleSheet.absoluteFill, rContainerStyle]}>
      <Backdrop />
      <RecentPhotos />
      <MenuItems />
      <Overlay />
    </Animated.View>
  );
};
