import React, { FC } from "react";
import { Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export const _titleHeight = 36;

type Props = {
  listOffsetY: SharedValue<number>;
  inputRange: [number, number];
};

export const Title: FC<Props> = ({ listOffsetY, inputRange }) => {
  const rTitleStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(listOffsetY.value, inputRange, [_titleHeight, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={rTitleStyle}>
      <Text
        className="text-neutral-300 font-bold text-3xl absolute -bottom-1"
        maxFontSizeMultiplier={1}
      >
        Chats
      </Text>
    </Animated.View>
  );
};
