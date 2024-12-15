import React, { FC, PropsWithChildren } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { AnimatedRow } from "./animated-row";

type Props = {
  isOpen: boolean;
};

export const MenuButtonsWrapper: FC<PropsWithChildren<Props>> = ({ isOpen, children }) => {
  const containerHeight = useSharedValue(0);

  if (!children) {
    return <></>;
  }

  return (
    <View className="gap-1" onLayout={(e) => (containerHeight.value = e.nativeEvent.layout.height)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return <></>;
        }

        return (
          <AnimatedRow
            key={index}
            isOpen={isOpen}
            rowNumber={index}
            totalRows={React.Children.count(children)}
            containerHeight={containerHeight}
          >
            {child}
          </AnimatedRow>
        );
      })}
    </View>
  );
};
