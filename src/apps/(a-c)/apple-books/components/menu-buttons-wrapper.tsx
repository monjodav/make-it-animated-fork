import { cn } from "@/src/shared/lib/utils/cn";
import React, { FC, PropsWithChildren } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { AnimatedRow } from "./animated-row";

// apple-books-menu-buttons-animation 🔽

type Props = {
  isOpen: boolean;
};

export const MenuButtonsWrapper: FC<PropsWithChildren<Props>> = ({ isOpen, children }) => {
  // Shared value tracks container height for proportional exit animations
  // Each AnimatedRow uses this to calculate its translateY distance
  const containerHeight = useSharedValue(0);

  if (!children) {
    return <></>;
  }

  return (
    <View
      className={cn("gap-1 pointer-events-none", isOpen && "pointer-events-auto")}
      // Capture container dimensions for animation calculations - triggered on mount and resize
      onLayout={(e) => (containerHeight.value = e.nativeEvent.layout.height)}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return <></>;
        }

        // Wrap each button in AnimatedRow with staggered animation props
        // Index and numberOfRows enable proportional timing and spacing calculations
        return (
          <AnimatedRow
            key={index}
            isOpen={isOpen}
            index={index} // Position in stack - affects animation delay and translateY
            numberOfRows={React.Children.count(children)} // Total count for proportional calculations
            containerHeight={containerHeight} // Shared reference for coordinated movement
          >
            {child}
          </AnimatedRow>
        );
      })}
    </View>
  );
};

// apple-books-menu-buttons-animation 🔼
