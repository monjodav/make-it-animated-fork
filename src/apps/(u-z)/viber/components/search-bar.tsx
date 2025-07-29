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
  offsetY?: SharedValue<number>; // Shared scroll position drives collapse animation
  height: number; // Fixed height for consistent animation calculations
  marginBottomMin?: number; // Minimum bottom margin when collapsed (default: 0)
  marginBottomMax: number; // Maximum bottom margin when expanded
  style?: Omit<ViewStyle, "height" | "margin" | "marginBottom">; // Exclude animated properties
};

export const SearchBar: FC<Props> = ({
  offsetY,
  height,
  marginBottomMin = 0,
  marginBottomMax,
  style,
}) => {
  // Search bar collapse animation: height and margin animate together for smooth transition
  const rHeightStyle = useAnimatedStyle(() => {
    // Static state when no scroll tracking (offsetY undefined)
    if (offsetY === undefined) {
      return {
        height,
        marginBottom: marginBottomMax,
      };
    }

    return {
      // Height collapse: [0, height] scroll maps to [height, 0] height
      // Search bar shrinks to 0 height over its own height distance (36px)
      height: interpolate(offsetY.value, [0, height], [height, 0], Extrapolation.CLAMP),
      // Margin animation: 3-point interpolation for staged collapse
      // [0, height]: margin stays at max (24px) while height collapses
      // [height, height + marginDelta]: margin reduces from max to min (24px → 8px)
      // Creates natural two-stage collapse: height first, then margin
      marginBottom: interpolate(
        offsetY?.value ?? 0,
        [0, height, height + marginBottomMax - marginBottomMin],
        [marginBottomMax, marginBottomMax, marginBottomMin],
        Extrapolation.CLAMP // Prevent over-animation beyond defined ranges
      ),
    };
  });

  // Content fade animation: text and icon disappear quickly for clean collapse
  const rOpacityStyle = useAnimatedStyle(() => {
    // Static opacity when no scroll tracking
    if (offsetY === undefined)
      return {
        opacity: 1,
      };

    return {
      // Fast fade: content disappears in first quarter of height collapse (9px of 36px)
      // Input range [0, height/4] maps to opacity [1, 0] for quick content removal
      // Prevents text/icon from being visible during height collapse animation
      opacity: interpolate(offsetY.value, [0, height / 4], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      className="bg-neutral-900 rounded-full justify-center"
      style={[rHeightStyle, style]} // Height and margin animations applied to container
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
