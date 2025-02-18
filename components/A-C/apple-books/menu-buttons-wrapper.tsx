import { cn } from "@/utils/cn";
import React, { FC, PropsWithChildren } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { AnimatedRow } from "./animated-row";

// apple-books-menu-buttons-animation 🔽

type Props = {
  isOpen: boolean;
};

export const MenuButtonsWrapper: FC<PropsWithChildren<Props>> = ({ isOpen, children }) => {
  const containerHeight = useSharedValue(0);

  if (!children) {
    return <></>;
  }

  return (
    <View
      className={cn("gap-1 pointer-events-none", isOpen && "pointer-events-auto")}
      onLayout={(e) => (containerHeight.value = e.nativeEvent.layout.height)}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return <></>;
        }

        return (
          <AnimatedRow
            key={index}
            isOpen={isOpen}
            index={index}
            numberOfRows={React.Children.count(children)}
            containerHeight={containerHeight}
          >
            {child}
          </AnimatedRow>
        );
      })}
    </View>
  );
};

// apple-books-menu-buttons-animation 🔼
