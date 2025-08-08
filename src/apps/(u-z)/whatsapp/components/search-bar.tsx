import { Search } from "lucide-react-native";
import React, { FC } from "react";
import { StyleSheet, TextInput, ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// whatsapp-updates-screen-header-animation 🔽

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
  // Two-stage collapse: (1) height shrinks to 0 within `height` px scroll, (2) margin reduces to compact spacing
  // Keeps layout stable and visually mirrors WhatsApp's search collapse behavior
  const rHeightStyle = useAnimatedStyle(() => {
    return {
      // Height interpolation: 0 → height scroll maps to height → 0, clamped to avoid negative heights
      height: interpolate(offsetY?.value ?? 0, [0, height], [height, 0], Extrapolation.CLAMP),
      // Margin interpolation: stays at max while height collapses, then eases to min after height reaches 0
      // Input: [0, height, height + (max-min)] → Output: [max, max, min]
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
      // Content fades quickly to avoid clipped text during height collapse
      // Input: [0, height/4] → Output: [1, 0], clamped to keep it hidden afterwards
      opacity: interpolate(offsetY?.value ?? 0, [0, height / 4], [1, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      className="bg-neutral-900 rounded-xl justify-center"
      // Style exclusions ensure height/margins are driven only by animated styles
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
    // iOS 16+ continuous curves; inexpensive and matches native feel
    borderCurve: "continuous",
  },
  searchIcon: {
    position: "absolute",
    left: 8,
  },
});

// whatsapp-updates-screen-header-animation 🔼
