import React, { FC } from "react";
import { TouchableOpacity } from "react-native";
import Reanimated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// threads-home-header-tabs-animation 🔽

type Props = {
  index: number;
  tabName: string;
  indexDecimal: SharedValue<number>;
  onPress: () => void;
};

export const TabItem: FC<Props> = ({ index, tabName, indexDecimal, onPress }) => {
  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      indexDecimal.value,
      [index - 1, index, index + 1],
      ["#737373", "#fff", "#737373"]
    );
    return { color };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="flex-1 items-center justify-center"
    >
      <Reanimated.Text className="text-base font-semibold" style={rTextStyle}>
        {tabName}
      </Reanimated.Text>
    </TouchableOpacity>
  );
};

// threads-home-header-tabs-animation 🔼
