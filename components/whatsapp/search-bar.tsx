import { Search } from "lucide-react-native";
import React, { FC } from "react";
import { StyleSheet, TextInput, ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  offsetY: SharedValue<number>;
  height: number;
  marginBottomMin: number;
  marginBottomMax: number;
  style?: Omit<ViewStyle, "height" | "margin" | "marginBottom">;
};

export const SearchBar: FC<Props> = ({
  offsetY,
  height,
  marginBottomMin,
  marginBottomMax,
  style,
}) => {
  const rHeightStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(offsetY?.value ?? 0, [0, height], [height, 0], Extrapolation.CLAMP),
      marginBottom: interpolate(
        offsetY?.value ?? 0,
        [0, height, height + marginBottomMax - marginBottomMin],
        [marginBottomMax, marginBottomMax, marginBottomMin],
        Extrapolation.CLAMP
      ),
    };
  });

  const rOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(offsetY?.value ?? 0, [0, height / 4], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      className="bg-neutral-900 rounded-xl justify-center"
      style={[rHeightStyle, styles.container, style]}
    >
      <Animated.View className="justify-center h-full" style={rOpacityStyle}>
        <TextInput className="px-4 py-2 pl-9" placeholder="Search" placeholderTextColor="gray" />
        <Search size={16} color="gray" style={styles.searchIcon} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
  searchIcon: {
    position: "absolute",
    left: 8,
  },
});
