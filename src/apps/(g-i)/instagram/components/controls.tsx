import { cn } from "@/src/shared/lib/utils/cn";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftRight, ChevronDown, CircleStop, Infinity } from "lucide-react-native";
import React, { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { _height, ControlItem } from "./control-item";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// instagram-story-controls-animation 🔽

// Enables Reanimated animations on Pressable for smooth fade transitions
// Required for entering/exiting animations and overlay interactions
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type Position = "left" | "right";

// Screen edge padding - affects gradient direction and position switch button placement
export const _padding = 16;
// Consistent icon sizing across all control items for visual harmony
export const _iconSize = 24;
// Pure white ensures visibility against dark gradient overlay
export const _iconColor = "#fff";

export const Controls: FC = () => {
  const [controlsPosition, setControlsPosition] = useState<Position>("left");
  const [isOpen, setIsOpen] = useState(false);

  const className = {
    label: "text-white text-sm",
  };

  // Slides top 3 items (Create, Boomerang, Layout) up/down from center
  // Closed: +20px (half height) creates stacked appearance with middle item
  const rTopItemsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isOpen ? 0 : _height / 2, { duration: 200 }) }],
    };
  });

  // Fades labels in/out - icons remain visible for quick recognition when closed
  // 200ms duration matches transform animations for synchronized reveal
  const rLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
    };
  });

  // Slides close button down/up from center (opposite of top items)
  // Closed: -20px creates symmetric stacking effect around middle "Hands-free" item
  const rCloseItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isOpen ? 0 : -(_height / 2), { duration: 200 }) }],
    };
  });

  // Rotates chevron to indicate state: down = closed/expandable, up = open/collapsible
  // 180deg rotation provides clear visual feedback for interaction affordance
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
      {/* Overlay backdrop - provides contrast and tap-to-close functionality */}
      {isOpen && (
        <AnimatedPressable
          entering={FadeIn} // Smooth fade prevents jarring overlay appearance
          exiting={FadeOut}
          style={StyleSheet.absoluteFillObject}
          onPress={() => setIsOpen(!isOpen)} // Tap anywhere to close
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "transparent"]} // Dark to transparent for readability
            style={StyleSheet.absoluteFillObject}
            // Gradient direction follows control position: left = left-to-right fade
            start={{ x: controlsPosition === "left" ? 0 : 1, y: 0 }}
            end={{ x: controlsPosition === "left" ? 1 : 0, y: 0 }}
            dither={false} // Prevents banding on gradient for smoother appearance
          />
        </AnimatedPressable>
      )}
      {/* Position toggle button - allows switching between left/right thumb accessibility */}
      {isOpen && (
        <AnimatedPressable
          entering={FadeIn} // Fades in with overlay for coordinated reveal
          exiting={FadeOut}
          className="absolute"
          style={[
            styles.arrowLeftRightContainer, // Top positioning with _padding offset
            {
              // Dynamic positioning: mirrors control alignment for intuitive placement
              left: controlsPosition === "left" ? _padding : undefined,
              right: controlsPosition === "right" ? _padding : undefined,
            },
          ]}
          hitSlop={10} // Expanded touch target for easier interaction
          onPress={() => {
            setControlsPosition(controlsPosition === "left" ? "right" : "left");
          }}
        >
          <ArrowLeftRight size={_iconSize} color={_iconColor} />
        </AnimatedPressable>
      )}
      <View>
        {/* Top items group - slides as unit for cohesive stacking animation */}
        <Animated.View style={rTopItemsStyle}>
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<Text className="text-white text-2xl">Aa</Text>}
            label={
              <Animated.View style={rLabelStyle}>
                <Text className={className.label}>Create</Text>
              </Animated.View>
            }
            onPress={simulatePress}
          />
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<Infinity size={_iconSize} color={_iconColor} />}
            label={
              <Animated.View style={rLabelStyle}>
                <Text className={className.label}>Boomerang</Text>
              </Animated.View>
            }
            onPress={simulatePress}
          />
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<Feather name="layout" size={_iconSize} color="white" />}
            label={
              <Animated.View style={rLabelStyle}>
                <Text className={className.label}>Layout</Text>
              </Animated.View>
            }
            onPress={simulatePress}
          />
        </Animated.View>
        {/* Middle item - remains stationary as anchor point for top/bottom animations */}
        <Animated.View style={rLabelStyle}>
          {/* Only label fades, position stays fixed */}
          <ControlItem
            controlsPosition={controlsPosition}
            icon={<CircleStop size={_iconSize} color={_iconColor} />}
            label={<Text className={className.label}>Hands-free</Text>} // No Animated wrapper - simpler fade
            onPress={simulatePress}
          />
        </Animated.View>
        {/* Bottom item - slides opposite direction from top items */}
        <Animated.View style={rCloseItemStyle}>
          <ControlItem
            controlsPosition={controlsPosition}
            icon={
              <Animated.View
                style={[
                  rChevronDownStyle, // Rotation animation for state indication
                  {
                    transformOrigin: "center", // Ensures rotation around icon center
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
    padding: _padding, // Consistent edge spacing for all control elements
  },
  arrowLeftRightContainer: {
    top: _padding, // Aligns position toggle with container padding for visual consistency
  },
});

// instagram-story-controls-animation 🔼
