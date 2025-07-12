import { MenuIcon } from "lucide-react-native";
import React, { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

// apple-books-menu-buttons-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const MenuTrigger: FC<Props> = ({ isOpen, setIsOpen }) => {
  // Trigger button animation: fade out and shrink when menu opens
  // Creates visual feedback that menu is active and trigger is temporarily disabled
  const rStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen ? 0 : 1), // Fade to invisible when menu is open
    transform: [{ scale: withTiming(isOpen ? 0.5 : 1) }], // Shrink to half size for subtle disappear effect
  }));

  return (
    <AnimatedPressable
      className="p-1 bg-neutral-800 rounded-lg items-center justify-center self-end mr-4 mt-1"
      style={[styles.container, rStyle]}
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

// apple-books-menu-buttons-animation 🔼
