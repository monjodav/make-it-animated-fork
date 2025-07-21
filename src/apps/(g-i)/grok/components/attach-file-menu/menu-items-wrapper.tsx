import React, { FC, PropsWithChildren } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AnimatedRow } from "./animated-row";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// grok-attach-file-menu-animation 🔽

export const MenuItemsWrapper: FC<PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();

  const { isMenuOpen } = useAttachFileMenu();

  // Track container height for calculating individual row slide distances
  // Each row slides from its final position to create staggered entrance effect
  const containerHeight = useSharedValue(0);

  // Fade and pointer events coordination for entire menu container
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMenuOpen.get() ? 1 : 0), // Fade entire menu in/out
      pointerEvents: isMenuOpen.get() ? "box-none" : "none", // Allow child interactions when open
    };
  });

  if (!children) {
    return <></>;
  }

  return (
    <Animated.View
      className="items-start gap-9" // Left-aligned with consistent 36px spacing between items
      style={[rContainerStyle, { marginBottom: insets.bottom + 55 }]} // 55px accounts for tab bar + padding
      onLayout={(e) => containerHeight.set(e.nativeEvent.layout.height)} // Measure for slide calculations
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return <></>;
        }

        return (
          // Wrap each menu item in animated row for individual slide-in timing
          <AnimatedRow
            key={index}
            index={index} // Row position for staggered animation timing
            numberOfRows={React.Children.count(children)} // Total count for slide distance calculation
            containerHeight={containerHeight} // Container height for proportional slide distances
            isMenuOpen={isMenuOpen} // Shared animation state
          >
            {child}
          </AnimatedRow>
        );
      })}
    </Animated.View>
  );
};

// grok-attach-file-menu-animation 🔼
