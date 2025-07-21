import React, { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";

// grok-attach-file-menu-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MenuTrigger: FC = () => {
  const { isMenuOpen } = useAttachFileMenu();

  const rContainerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isMenuOpen.get() ? 0 : 1, {
      duration: 200,
      easing: Easing.in(Easing.ease),
    }),
    transform: [
      {
        scale: isMenuOpen.get()
          ? withTiming(4)
          : withSpring(1, { damping: 40, stiffness: 600, mass: 2 }),
      },
    ],
  }));

  return (
    <AnimatedPressable
      className="h-full aspect-square rounded-full items-center justify-center border-[2px] border-white/5"
      style={[styles.container, rContainerStyle]}
      onPress={() => isMenuOpen.set(true)}
    >
      <MaterialCommunityIcons name="paperclip" size={16} color="white" />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});

// grok-attach-file-menu-animation 🔼
