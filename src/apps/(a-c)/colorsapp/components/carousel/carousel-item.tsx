import React, { FC, useCallback, useEffect } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, useWindowDimensions, View, Text, ColorValue } from "react-native";

import { ColorCircleOne } from "./color-circle-one";
import { ColorCircleTwo } from "./color-circle-two";
import { ColorCircleThree } from "./color-circle-three";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// colorsapp-card-blurry-circles-animation 🔽

type Props = {
  color: "primary" | "secondary" | "tertiary";
  text1: string;
  text2: string;
  colorAnimationVariant: number;
};

export const CarouselItem: FC<Props> = ({ color, text1, text2, colorAnimationVariant }) => {
  const { width } = useWindowDimensions();

  // Palette per card. Order goes light → mid → accent to feed both backgrounds and inner circles.
  // Keeping these here avoids re-allocations and documents the gradient direction for consistency.
  const colors = React.useMemo(
    () => ({
      primary: ["#FBCBE5", "#F9A8D4", "#EA1088"],
      secondary: ["#FBDACB", "#F8C2A9", "#E75613"],
      tertiary: ["#CACCFB", "#A5A8F9", "#1017EA"],
    }),
    []
  );

  // Shared rotation angle that drives the inner Skia circles container.
  // String degrees let us swap directions easily while keeping transform API simple.
  const rotate = useSharedValue("0deg");

  useEffect(() => {
    // Stagger start: variant index × 500ms avoids all cards spinning in sync.
    // Direction flip: variant 1 clockwise, others counter-clockwise for visual variety.
    // 20s duration keeps the motion ambient (non-distracting), "true" yoyo prevents easing drift.
    rotate.set(
      withDelay(
        colorAnimationVariant * 500,
        withRepeat(
          withTiming(colorAnimationVariant === 1 ? "360deg" : "-360deg", { duration: 20000 }),
          -1,
          true
        )
      )
    );
  }, []);

  // Fades the temporary placeholder out once the animation mounts.
  // Long 2s fade ensures no sudden pop while Skia warms up on low-end devices.
  const placeholderStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(0, { duration: 2000 }),
    };
  });

  const renderColorCircle = useCallback(() => {
    switch (colorAnimationVariant) {
      case 1:
        return (
          // Cross-fade between variants to avoid abrupt content swaps on list re-renders.
          <Animated.View className="flex-1" entering={FadeIn} exiting={FadeOut}>
            <ColorCircleOne primaryColor={colors[color][1]} />
          </Animated.View>
        );
      case 2:
        return (
          // Cross-fade between variants to avoid abrupt content swaps on list re-renders.
          <Animated.View className="flex-1" entering={FadeIn} exiting={FadeOut}>
            <ColorCircleTwo primaryColor={colors[color][1]} />
          </Animated.View>
        );
      case 3:
        return (
          // Cross-fade between variants to avoid abrupt content swaps on list re-renders.
          <Animated.View className="flex-1" entering={FadeIn} exiting={FadeOut}>
            <ColorCircleThree primaryColor={colors[color][1]} />
          </Animated.View>
        );
    }
  }, [color, colors, colorAnimationVariant]);

  return (
    <View
      className="px-4 pb-4 rounded-2xl justify-between overflow-hidden"
      style={{
        paddingTop: width * 0.08,
        width: width * 0.4,
        height: width * 0.65,
      }}
    >
      <LinearGradient
        colors={colors[color] as [ColorValue, ColorValue, ...ColorValue[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={["#231E2B50", "transparent"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View
        className="bg-white rounded-full self-center overflow-hidden border-[1.5px]"
        style={{
          width: width * 0.24,
          height: width * 0.24,
          backgroundColor: "#1B1721",
          borderColor: "#E5E5E520",
        }}
      >
        <Animated.View className="flex-1" style={{ transform: [{ rotate }] }}>
          {renderColorCircle()}
          <Animated.View
            style={placeholderStyle}
            className="absolute w-full h-full rounded-full bg-red-200"
          />
        </Animated.View>
      </View>
      <View>
        <Text className="font-bold text-[16px] text-[#E5E5E5] mb-1">{text1}</Text>
        <Text className="font-p-sb text-[14px] mt-[-4px] text-[#E5E5E5]/80" numberOfLines={1}>
          {text2}
        </Text>
      </View>
    </View>
  );
};

// colorsapp-card-blurry-circles-animation 🔼
