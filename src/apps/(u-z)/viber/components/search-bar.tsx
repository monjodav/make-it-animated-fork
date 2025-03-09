import { Search } from "lucide-react-native";
import React, { FC } from "react";
import { StyleSheet, TextInput, ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// viber-chats-header-animation 🔽

type Props = {
  offsetY?: SharedValue<number>;
  height: number;
  marginBottomMin?: number;
  marginBottomMax: number;
  style?: Omit<ViewStyle, "height" | "margin" | "marginBottom">;
};

export const SearchBar: FC<Props> = ({
  offsetY,
  height,
  marginBottomMin = 0,
  marginBottomMax,
  style,
}) => {
  const rHeightStyle = useAnimatedStyle(() => {
    if (offsetY === undefined) {
      return {
        height,
        marginBottom: marginBottomMax,
      };
    }

    return {
      height: interpolate(offsetY.value, [0, height], [height, 0], Extrapolation.CLAMP),
      marginBottom: interpolate(
        offsetY?.value ?? 0,
        [0, height, height + marginBottomMax - marginBottomMin],
        [marginBottomMax, marginBottomMax, marginBottomMin],
        Extrapolation.CLAMP
      ),
    };
  });

  const rOpacityStyle = useAnimatedStyle(() => {
    if (offsetY === undefined)
      return {
        opacity: 1,
      };

    return {
      opacity: interpolate(offsetY.value, [0, height / 4], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      className="bg-neutral-900 rounded-full justify-center"
      style={[rHeightStyle, style]}
    >
      <Animated.View className="justify-center h-full" style={rOpacityStyle}>
        <TextInput className="px-4 py-2 pl-9" placeholder="Search" placeholderTextColor="gray" />
        <Search size={16} color="gray" style={styles.searchIcon} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    position: "absolute",
    left: 8,
  },
});

// viber-chats-header-animation 🔼
