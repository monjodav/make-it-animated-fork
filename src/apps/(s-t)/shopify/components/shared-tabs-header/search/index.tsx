import React, { FC } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { SearchBar } from "./search-bar";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import { SearchFilters } from "./search-filters";
import { SEARCH_BAR_HEIGHT } from "../../../lib/constants/styles";
import Animated, { FadeIn } from "react-native-reanimated";

export const Search: FC = () => {
  const router = useRouter();

  return (
    <Animated.View entering={FadeIn.delay(200).duration(150)}>
      <View className="flex-row items-center gap-2" style={styles.searchBarContainer}>
        <Pressable
          onPress={router.back}
          className="h-full aspect-square rounded-full items-center justify-center bg-[#303030]"
        >
          <X size={22} color="#E5E7EB" />
        </Pressable>
        <SearchBar />
      </View>
      <SearchFilters />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    height: SEARCH_BAR_HEIGHT,
  },
});
