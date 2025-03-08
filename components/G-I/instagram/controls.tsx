import { cn } from "@/src/lib/utils/cn";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftRight, ChevronDown, CircleStop, Infinity } from "lucide-react-native";
import React, { FC, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { _height, ControlItem } from "./control-item";

// instagram-story-controls-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type Position = "left" | "right";

export const _padding = 16;
export const _iconSize = 24;
export const _iconColor = "#fff";

export const Controls: FC = () => {
  const [controlsPosition, setControlsPosition] = useState<Position>("left");
  const [isOpen, setIsOpen] = useState(false);

  const className = {
    label: "text-white text-sm",
  };

  const rTopItemsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isOpen ? 0 : _height / 2, { duration: 200 }) }],
    };
  });

  const rLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
    };
  });

  const rCloseItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isOpen ? 0 : -(_height / 2), { duration: 200 }) }],
    };
  });

  const rChevronDownStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(isOpen ? "180deg" : "0deg", { duration: 200 }) }],
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, styles.container]}
      className={cn(
        "justify-center pointer-events-box-none",
        controlsPosition === "left" ? "items-start" : "items-end"
      )}
    >
      {isOpen && (
        <AnimatedPressable
          entering={FadeIn}
          exiting={FadeOut}
          style={StyleSheet.absoluteFillObject}
          onPress={() => setIsOpen(!isOpen)}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "transparent"]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: controlsPosition === "left" ? 0 : 1, y: 0 }}
            end={{ x: controlsPosition === "left" ? 1 : 0, y: 0 }}
            dither={false}
          />
        </AnimatedPressable>
      )}
      {isOpen && (
        <AnimatedPressable
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute"
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
      )}
      <View>
        <Animated.View style={rTopItemsStyle}>
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<Text className="text-white text-2xl">Aa</Text>}
            label={
              <Animated.View style={rLabelStyle}>
                <Text className={className.label}>Create</Text>
              </Animated.View>
            }
            onPress={() => Alert.alert("Create")}
          />
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<Infinity size={_iconSize} color={_iconColor} />}
            label={
              <Animated.View style={rLabelStyle}>
                <Text className={className.label}>Boomerang</Text>
              </Animated.View>
            }
            onPress={() => Alert.alert("Boomerang")}
          />
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<Feather name="layout" size={_iconSize} color="white" />}
            label={
              <Animated.View style={rLabelStyle}>
                <Text className={className.label}>Layout</Text>
              </Animated.View>
            }
            onPress={() => Alert.alert("Layout")}
          />
        </Animated.View>
        <Animated.View style={rLabelStyle}>
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<CircleStop size={_iconSize} color={_iconColor} />}
            label={<Text className={className.label}>Hands-free</Text>}
            onPress={() => Alert.alert("Hands-free")}
          />
        </Animated.View>
        <Animated.View style={rCloseItemStyle}>
          <ControlItem
            controlsPosition={controlsPosition}
            icon={
              <Animated.View
                style={[
                  rChevronDownStyle,
                  {
                    transformOrigin: "center",
                  },
                ]}
              >
                <ChevronDown size={_iconSize + 8} color={_iconColor} strokeWidth={1.5} />
              </Animated.View>
            }
            label={
              <Animated.View style={rLabelStyle}>
                <Text className={className.label}>Close</Text>
              </Animated.View>
            }
            onPress={() => setIsOpen(!isOpen)}
          />
        </Animated.View>
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

// instagram-story-controls-animation 🔼
