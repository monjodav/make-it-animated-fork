import { cn } from "@/utils/cn";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftRight, ChevronUp, CircleStop, Infinity } from "lucide-react-native";
import React, { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { ControlItem } from "./control-item";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type Position = "left" | "right";

export const _padding = 16;
export const _iconSize = 24;
export const _iconColor = "#fff";

export const Controls: FC = () => {
  const [controlsPosition, setControlsPosition] = useState<Position>("left");

  const className = {
    label: "text-white text-sm",
  };

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.container]}
      className={cn("justify-center", controlsPosition === "left" ? "items-start" : "items-end")}
    >
      <AnimatedPressable style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={StyleSheet.absoluteFillObject}
          start={{ x: controlsPosition === "left" ? 0 : 1, y: 0 }}
          end={{ x: controlsPosition === "left" ? 1 : 0, y: 0 }}
          dither={false}
        />
      </AnimatedPressable>
      <AnimatedPressable
        className={"absolute"}
        style={[
          styles.arrowLeftRightContainer,
          {
            left: controlsPosition === "left" ? _padding : undefined,
            right: controlsPosition === "right" ? _padding : undefined,
          },
        ]}
        hitSlop={10}
        onPress={() => {
          setControlsPosition(controlsPosition === "left" ? "right" : "left");
        }}
      >
        <ArrowLeftRight size={_iconSize} color={_iconColor} />
      </AnimatedPressable>
      <View className="gap-5">
        <ControlItem
          controlsPosition={controlsPosition}
          icon={<Text className="text-white text-2xl">Aa</Text>}
          label={<Text className={className.label}>Create</Text>}
        />
        <ControlItem
          controlsPosition={controlsPosition}
          icon={<Infinity size={_iconSize} color={_iconColor} />}
          label={<Text className={className.label}>Boomerang</Text>}
        />
        <ControlItem
          controlsPosition={controlsPosition}
          icon={<Feather name="layout" size={_iconSize} color="white" />}
          label={<Text className={className.label}>Layout</Text>}
        />
        <ControlItem
          controlsPosition={controlsPosition}
          icon={<CircleStop size={_iconSize} color={_iconColor} />}
          label={<Text className={className.label}>Hands-free</Text>}
        />
        <ControlItem
          controlsPosition={controlsPosition}
          icon={<ChevronUp size={_iconSize} color={_iconColor} />}
          label={<Text className={className.label}>Close</Text>}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: _padding,
  },
  arrowLeftRightContainer: {
    top: _padding,
  },
});
