import { Search } from "lucide-react-native";
import React, { FC } from "react";
import { StyleSheet, TextInput } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export const _searchBarHeight = 36;

// viber-chats-search-bar-animation 🔽

type Props = {
  offsetY: SharedValue<number>;
};

export const SearchBar: FC<Props> = ({ offsetY }) => {
  const rHeightStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        offsetY?.value ?? 0,
        [0, _searchBarHeight],
        [_searchBarHeight, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const rOpacityStyle = useAnimatedStyle(() => {
    // if (!hideSearchBarOnScroll) {
    //   return {
    //     opacity: 1,
    //   };
    // }

    return {
      opacity: interpolate(
        offsetY?.value ?? 0,
        [0, _searchBarHeight / 4],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View
      className="bg-neutral-900 rounded-lg justify-center"
      style={[rHeightStyle, styles.container]}
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

// viber-chats-search-bar-animation 🔼
