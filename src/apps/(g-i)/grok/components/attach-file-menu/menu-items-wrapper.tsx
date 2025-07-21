import React, { FC, PropsWithChildren } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AnimatedRow } from "./animated-row";
import { useAttachFileMenu } from "../../lib/providers/attach-file-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// grok-attach-file-menu-animation 🔽

export const MenuItemsWrapper: FC<PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();

  const { isMenuOpen } = useAttachFileMenu();

  const containerHeight = useSharedValue(0);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isMenuOpen.get() ? 1 : 0),
      pointerEvents: isMenuOpen.get() ? "box-none" : "none",
    };
  });

  if (!children) {
    return <></>;
  }

  return (
    <Animated.View
      className="items-start gap-9"
      style={[rContainerStyle, { marginBottom: insets.bottom + 55 }]}
      onLayout={(e) => containerHeight.set(e.nativeEvent.layout.height)}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return <></>;
        }

        return (
          <AnimatedRow
            key={index}
            index={index}
            numberOfRows={React.Children.count(children)}
            containerHeight={containerHeight}
            isMenuOpen={isMenuOpen}
          >
            {child}
          </AnimatedRow>
        );
      })}
    </Animated.View>
  );
};

// grok-attach-file-menu-animation 🔼
