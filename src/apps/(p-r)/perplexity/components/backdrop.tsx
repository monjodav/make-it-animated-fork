import { FC } from "react";
import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, useColorScheme } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  useDerivedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type Props = BottomSheetBackdropProps;

export const Backdrop: FC<Props> = ({ animatedIndex, style }) => {
  const insets = useSafeAreaInsets();

  // const containerStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: interpolate(animatedIndex.value, [-1, 0, 1], [0, 0, 1], Extrapolation.CLAMP),
  //   };
  // });

  // useDerivedValue(() => {
  //   console.log(animatedIndex);
  // });

  const blurIntensity = useDerivedValue(() => {
    const maxIntensity = 25;

    return interpolate(
      animatedIndex.value,
      [-1, -0.5, 0, 1, 2], // support potential extra snap >1
      [0, 0, maxIntensity / 2, maxIntensity, 0],
      Extrapolation.CLAMP
    );
  }, []);

  const animatedIntensity = useDerivedValue(
    () => blurIntensity.value as number | undefined,
    [blurIntensity]
  );

  return (
    // <BottomSheetBackdrop
    //   animatedIndex={animatedIndex}
    //   disappearsOnIndex={-1}
    //   appearsOnIndex={0}
    //   opacity={1}
    //   {...props}
    // >
    <Animated.View
      pointerEvents={animatedIndex.value < 0 ? "none" : "auto"}
      style={[StyleSheet.absoluteFill, style]}
    >
      <AnimatedBlurView intensity={animatedIntensity} tint="dark" style={StyleSheet.absoluteFill} />

      {/* <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.40)" }]} /> */}

      <View pointerEvents="none" style={{ paddingTop: insets.top }} />
    </Animated.View>
    // </BottomSheetBackdrop>
  );
};
