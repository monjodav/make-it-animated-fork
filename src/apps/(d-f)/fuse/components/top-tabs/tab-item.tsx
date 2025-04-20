import React, { FC } from "react";
import { LayoutChangeEvent, Pressable, useWindowDimensions } from "react-native";
import Animated, { interpolateColor, SharedValue, useAnimatedStyle } from "react-native-reanimated";

const _defaultColor = "#737373";
const _activeColor = "#171717";

export type TabItemProps = {
  index: number;
  label: string;
  horizontalListOffsetX: SharedValue<number>;
  onPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
};

export const TabItem: FC<TabItemProps> = ({
  index,
  label,
  horizontalListOffsetX,
  onPress,
  onLayout,
}) => {
  const { width } = useWindowDimensions();

  const rTextStyle = useAnimatedStyle(() => {
    const progress = horizontalListOffsetX.value / width;

    return {
      color: interpolateColor(
        progress,
        [index - 1, index, index + 1],
        [_defaultColor, _activeColor, _defaultColor]
      ),
    };
  });

  return (
    <Pressable className="py-2 px-1" onPress={onPress} onLayout={onLayout}>
      <Animated.Text style={rTextStyle} className="font-bold text-base text-neutral-900">
        {label}
      </Animated.Text>
    </Pressable>
  );
};
