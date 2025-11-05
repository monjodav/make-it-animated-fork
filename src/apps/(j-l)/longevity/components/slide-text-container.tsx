import { cn } from "@/src/shared/lib/utils/cn";
import { BlurView } from "expo-blur";
import React, { FC, PropsWithChildren } from "react";
import { View, Text, ViewProps, StyleSheet } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

interface Props extends AnimatedProps<ViewProps> {
  className?: string;
  textClassName?: string;
}

export const SlideTextContainer: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  textClassName,
  style,
  ...props
}) => {
  return (
    <Animated.View
      style={[styles.borderCurve, style]}
      className={cn("p-4 rounded-full overflow-hidden", className)}
      {...props}
    >
      <BlurView tint="dark" style={StyleSheet.absoluteFill} />
      <Text className={cn("text-xl font-medium text-white", textClassName)}>{children}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
