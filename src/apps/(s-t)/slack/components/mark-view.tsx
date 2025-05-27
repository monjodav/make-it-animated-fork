import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { FC } from "react";
import { useDerivedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, View, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import { EyeClosed } from "lucide-react-native";
import { colorKit } from "reanimated-color-picker";

const SIZE = 60;
const STROKE_WIDTH = 3;
const ICON_SIZE = 24;

const TRANSPARENT = colorKit.setAlpha("#fff", 0).hex();

type Props = {
  variant: "keep-read" | "keep-unread";
};

export const MarkView: FC<Props> = ({ variant }) => {
  const { panX, panDistance, isDragging } = useChannelAnimation();

  const sign = variant === "keep-read" ? 1 : -1;

  const rContainerStyle = useAnimatedStyle(() => {
    if (!isDragging.value) {
      return {
        opacity: withTiming(0, { duration: 100 }),
      };
    }
    return {
      opacity: interpolate(panX.value, [0, sign * panDistance], [0, 1]),
    };
  });

  const rIconContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        Math.abs(panX.value) + STROKE_WIDTH / 2 > panDistance ? "white" : TRANSPARENT,
        {
          duration: 100,
        }
      ),
    };
  });

  // Create an animated path that fills based on panX
  const animatedPath = useDerivedValue(() => {
    const skPath = Skia.Path.Make();

    // Calculate the end angle based on panX (0 to 2π)
    const progress = Math.abs(panX.value) / panDistance;
    const endAngle = 2 * Math.PI * progress;

    // Draw an arc
    skPath.addArc(
      {
        x: 0 + STROKE_WIDTH / 2,
        y: 0 + STROKE_WIDTH / 2,
        width: SIZE - STROKE_WIDTH,
        height: SIZE - STROKE_WIDTH,
      },
      -90, // Start from top (0 is right, -90 is top)
      endAngle * (180 / Math.PI) // Convert to degrees
    );

    return skPath;
  }, [panX, panDistance]);

  const rIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(Math.abs(panX.value) + STROKE_WIDTH / 2 > panDistance ? 1 : 0, {
        duration: 200,
      }),
    };
  });

  return (
    <Animated.View className="gap-2" style={rContainerStyle}>
      <Animated.View
        className="rounded-full items-center justify-center"
        style={[styles.iconContainer, rIconContainerStyle]}
      >
        <Canvas style={styles.canvas}>
          <Path
            path={animatedPath}
            color="white"
            style="stroke"
            strokeWidth={STROKE_WIDTH}
            strokeCap="round"
          />
        </Canvas>
        {variant === "keep-read" ? (
          <View className="items-center justify-center">
            <Animated.View className="absolute">
              <FontAwesome6 name="check" size={ICON_SIZE} color="white" />
            </Animated.View>
            <Animated.View className="absolute" style={rIconStyle}>
              <FontAwesome6 name="check" size={ICON_SIZE} color="#292524" />
            </Animated.View>
          </View>
        ) : (
          <View className="items-center justify-center">
            <Animated.View className="absolute">
              <EyeClosed size={ICON_SIZE} color="white" />
            </Animated.View>
            <Animated.View className="absolute" style={rIconStyle}>
              <EyeClosed size={ICON_SIZE} color="#292524" />
            </Animated.View>
          </View>
        )}
      </Animated.View>
      {variant === "keep-read" ? (
        <View>
          <Text style={styles.text}>Mark as</Text>
          <Text style={styles.text}>Read</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Keep</Text>
          <Text style={styles.text}>Unread</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: SIZE,
    height: SIZE,
  },
  canvas: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0,
    color: "white",
  },
});
