import { Search } from "lucide-react-native";
import React, { FC } from "react";
import { StyleSheet, TextInput } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { SharedValue } from "react-native-reanimated";

// viber-chats-search-bar-animation 🔽

export const _searchBarHeight = 36;

type Props = {
  listOffsetY?: SharedValue<number>;
};

export const SearchBar: FC<Props> = ({ listOffsetY }) => {
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        listOffsetY?.value ?? 0,
        [0, _searchBarHeight],
        [_searchBarHeight, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const rContentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        listOffsetY?.value ?? 0,
        [0, _searchBarHeight / 4],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <Animated.View
      className="overflow-hidden bg-neutral-900 rounded-full"
      style={[rContainerStyle, styles.container]}
    >
      <Animated.View className="w-full h-full justify-center" style={rContentStyle}>
        <TextInput className="h-full px-4 pl-9" placeholder="Search" placeholderTextColor="gray" />
        <Search size={16} color="gray" style={styles.searchIcon} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: _searchBarHeight,
  },
  searchIcon: {
    position: "absolute",
    left: 8,
  },
});

// viber-chats-search-bar-animation 🔼
