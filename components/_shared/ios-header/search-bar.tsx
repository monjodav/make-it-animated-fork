import { Search } from "lucide-react-native";
import React, { FC } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useIosHeader } from "./provider";

const _searchBarPaddingBottom = 20;

// viber-chats-search-bar-animation 🔽

type Props = {
  hideSearchBarOnScroll?: boolean;
};

export const SearchBar: FC<Props> = ({ hideSearchBarOnScroll }) => {
  const { listOffsetY, searchbarHeight } = useIosHeader();

  const rHeightStyle = useAnimatedStyle(() => {
    if (!searchbarHeight.value) {
      return {};
    }

    if (!hideSearchBarOnScroll) {
      return {
        height: searchbarHeight.value - _searchBarPaddingBottom,
      };
    }

    return {
      height: interpolate(
        listOffsetY?.value ?? 0,
        [0, searchbarHeight.value - _searchBarPaddingBottom],
        [searchbarHeight.value - _searchBarPaddingBottom, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const rOpacityStyle = useAnimatedStyle(() => {
    if (!searchbarHeight.value) {
      return {};
    }

    if (!hideSearchBarOnScroll) {
      return {
        opacity: 1,
      };
    }

    return {
      opacity: interpolate(
        listOffsetY?.value ?? 0,
        [0, searchbarHeight.value / 4],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const rPaddingBottomStyle = useAnimatedStyle(() => {
    if (!searchbarHeight.value) {
      return {
        height: _searchBarPaddingBottom,
      };
    }

    if (!hideSearchBarOnScroll) {
      return {
        height: _searchBarPaddingBottom,
      };
    }

    return {
      height: interpolate(
        listOffsetY?.value ?? 0,
        [0, searchbarHeight.value - _searchBarPaddingBottom, searchbarHeight.value],
        [_searchBarPaddingBottom, _searchBarPaddingBottom, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View
      className="overflow-hidden"
      onLayout={({ nativeEvent }) => {
        searchbarHeight.value = nativeEvent.layout.height;
      }}
    >
      <Animated.View className="bg-neutral-900 rounded-full" style={rHeightStyle}>
        <Animated.View className="justify-center" style={rOpacityStyle}>
          <TextInput className="px-4 py-2 pl-9" placeholder="Search" placeholderTextColor="gray" />
          <Search size={16} color="gray" style={styles.searchIcon} />
        </Animated.View>
      </Animated.View>
      <Animated.View style={rPaddingBottomStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    position: "absolute",
    left: 8,
  },
});

// viber-chats-search-bar-animation 🔼
