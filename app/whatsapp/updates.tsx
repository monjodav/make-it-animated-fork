import React from "react";
import { Insets, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { HeaderTitle } from "@/components/whatsapp/header-title";
import { _searchBarHeight, SearchBar } from "@/components/whatsapp/search-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Updates() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const offsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      offsetY.value = y;
    },
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        offsetY.value,
        [0, _searchBarHeight],
        [0, _searchBarHeight],
        Extrapolation.CLAMP
      ),
    };
  });

  const rScrollIndicatorInsets = useDerivedValue<Insets>(() => {
    return {
      top: interpolate(
        offsetY.value,
        [0, _searchBarHeight, _searchBarHeight + 10],
        [insets.top, insets.top - _searchBarHeight / 2, insets.top - _searchBarHeight / 2 + 10],
        {
          extrapolateLeft: "clamp",
        }
      ),
    };
  });

  return (
    <View className="flex-1 bg-black">
      <Animated.ScrollView
        style={rContainerStyle}
        contentContainerClassName="p-5"
        contentContainerStyle={{ paddingTop: headerHeight + 16 }}
        indicatorStyle="white"
        scrollIndicatorInsets={rScrollIndicatorInsets}
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      >
        <HeaderTitle
          title="Updates"
          offsetY={offsetY}
          searchBarHeight={_searchBarHeight}
          className="mb-4"
        />
        <SearchBar offsetY={offsetY} />
        <View className="h-7 w-[80px] bg-neutral-900 rounded-full my-6" />

        {/* My Status Section */}
        <View className="flex-row items-center mb-8">
          <View className="h-14 w-14 rounded-full bg-neutral-900 mr-3" />
          <View>
            <View className="h-5 w-24 bg-neutral-900 rounded-full mb-1" />
            <View className="h-4 w-32 bg-neutral-900 rounded-full opacity-60" />
          </View>
          <View className="ml-auto flex-row">
            <View className="h-7 w-7 bg-neutral-900 rounded-full mr-3" />
            <View className="h-7 w-7 bg-neutral-900 rounded-full" />
          </View>
        </View>

        {/* Channels Section */}
        <View className="mb-4">
          <View className="h-7 w-[100px] bg-neutral-900 rounded-full mb-2" />
          <View className="h-4 w-[280px] bg-neutral-900 rounded-full opacity-60 mb-6" />
        </View>

        {/* Channel List */}
        <View className="h-5 w-[180px] bg-neutral-900 rounded-full mb-4" />

        {/* Channel Items */}
        {Array.from({ length: 15 }).map((item, index) => (
          <View key={index} className="flex-row items-center mb-6">
            <View className="h-12 w-12 rounded-full bg-neutral-900 mr-3" />
            <View>
              <View className="h-5 w-48 bg-neutral-900 rounded-full mb-1" />
              <View className="h-4 w-24 bg-neutral-900 rounded-full opacity-60" />
            </View>
            <View className="ml-auto">
              <View className="h-8 w-20 bg-green-500/5 rounded-full" />
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
