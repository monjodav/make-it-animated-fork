import { FC } from "react";
import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import Animated, { interpolate, Extrapolation, useAnimatedProps } from "react-native-reanimated";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const Backdrop: FC<BottomSheetBackdropProps> = ({ animatedIndex, style, ...props }) => {
  const animatedIntensity = useAnimatedProps(() => {
    const maxIntensity = 25;
    const intensity = interpolate(
      animatedIndex.value,
      [-1, -0.5, 0, 1, 2],
      [0, 0, maxIntensity / 2, maxIntensity, 0],
      Extrapolation.CLAMP
    );

    return {
      intensity,
    };
  });

  return (
    <BottomSheetBackdrop
      animatedIndex={animatedIndex}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={1}
      style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      {...props}
    >
      <AnimatedBlurView
        animatedProps={animatedIntensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
    </BottomSheetBackdrop>
  );
};
