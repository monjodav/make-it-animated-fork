import { cn } from "@/utils/cn";
import React, { FC, PropsWithChildren } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export const MenuButton: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  style,
  ...rest
}) => {
  return (
    <Pressable
      {...rest}
      className={cn("px-5 py-3 rounded-2xl bg-neutral-800", className)}
      style={[styles.container, style]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
    transformOrigin: "right",
  },
});
