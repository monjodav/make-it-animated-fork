import React, { FC, PropsWithChildren } from "react";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

type Props = {
  animatedIndex: SharedValue<number>;
  fontSize: number;
};

export const TranslateContainer: FC<PropsWithChildren<Props>> = ({
  children,
  animatedIndex,
  fontSize,
}) => {
  const rTranslateYContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -animatedIndex.get() * fontSize }],
    };
  });

  return (
    <Animated.View
      className="items-center"
      style={[rTranslateYContainerStyle, { height: fontSize * 10 }]}
    >
      {children}
    </Animated.View>
  );
};
