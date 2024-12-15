import { MenuIcon } from "lucide-react-native";
import React, { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};

export const MenuTrigger: FC<Props> = ({ setIsOpen }) => {
  return (
    <AnimatedPressable
      className="p-1 bg-neutral-800 rounded-lg items-center justify-center self-end mr-4 mt-1"
      style={styles.container}
      onPress={() => setIsOpen(true)}
    >
      <MenuIcon size={20} color="#d4d4d4" />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});
