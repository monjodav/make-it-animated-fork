import { MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import React, { FC } from "react";
import { TouchableOpacity, Platform } from "react-native";
import Reanimated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  index: number;
  activeTabIndex: SharedValue<number>;
  isFocused: boolean;
  options: MaterialTopTabNavigationOptions;
  onPress: () => void;
  onLongPress: () => void;
};

export const TabItem: FC<Props> = ({
  index,
  activeTabIndex,
  isFocused,
  options,
  onPress,
  onLongPress,
}) => {
  const rTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      activeTabIndex.value,
      [index - 1, index, index + 1],
      ["#737373", "#fff", "#737373"]
    );
    return { color };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      accessibilityRole={Platform.OS === "web" ? "link" : "button"}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center"
    >
      <Reanimated.Text className="text-base font-semibold" style={rTextStyle}>
        {options.title}
      </Reanimated.Text>
    </TouchableOpacity>
  );
};
