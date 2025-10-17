import React, { useState } from "react";
import { useScrollViewOffset } from "@/src/shared/lib/hooks/use-scroll-view-offset";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";

const TOP_POSITION = 150;
const BOTTOM_POSITION = 300;
const SIDE_POSITION = 16;

const HEADER_ITEM = "__header__";
const TITLE_TO_SEARCH_GAP = 20;
const WhereSection = () => {
  const insets = useSafeAreaInsets();

  const { scrollOffsetY, scrollHandler } = useScrollViewOffset();

  const [titleHeight, setTitleHeight] = useState(32);
  const containerTravel = TOP_POSITION - insets.top;
  const headerInternalTop = 16 - 16;

  const rHeaderSpacerStyle = useAnimatedStyle(() => {
    const initialPadding = titleHeight + TITLE_TO_SEARCH_GAP;
    const finalPadding = containerTravel - headerInternalTop;
    const height = interpolate(
      scrollOffsetY.get(),
      [0, containerTravel],
      [initialPadding, finalPadding],
      Extrapolation.CLAMP
    );
    return { height };
  }, [titleHeight, containerTravel]);

  const rFlatListContainerStyle = useAnimatedStyle(() => {
    const top = interpolate(
      scrollOffsetY.get(),
      [0, TOP_POSITION - insets.top],
      [TOP_POSITION, insets.top],
      Extrapolation.CLAMP
    );
    const bottom = interpolate(
      scrollOffsetY.get(),
      [0, TOP_POSITION - insets.top],
      [BOTTOM_POSITION, 0],
      Extrapolation.CLAMP
    );
    const side = interpolate(
      scrollOffsetY.get(),
      [0, TOP_POSITION - insets.top],
      [SIDE_POSITION, 0],
      Extrapolation.CLAMP
    );

    return {
      top: top,
      left: side,
      right: side,
      bottom: bottom,
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          backgroundColor: "white",
          borderRadius: 25,
        },
        rFlatListContainerStyle,
      ]}
    >
      <View className="absolute left-6 right-6 top-6">
        <Text
          className="text-3xl font-bold"
          onLayout={(e) => setTitleHeight(Math.round(e.nativeEvent.layout.height))}
        >
          Where?
        </Text>
      </View>

      <Animated.FlatList
        data={[HEADER_ITEM, ...Array.from({ length: 50 }).map((_, i) => i)]}
        keyExtractor={(item, index) => (item === HEADER_ITEM ? "header" : `${item}-${index}`)}
        renderItem={({ item, index }) => {
          if (item === HEADER_ITEM) {
            return <Text className="text-base font-semibold mb-2">Suggested destinations</Text>;
          }
          return (
            <View className="flex-row items-center gap-4 py-2">
              <View className="h-16 w-16 rounded-xl bg-cyan-100" />
              <View className="flex-1 gap-2">
                <View className="h-5 w-3/4 rounded-full bg-neutral-400" />
                <View className="h-5 w-50 rounded-full bg-neutral-200" />
              </View>
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View>
              <Animated.View style={rHeaderSpacerStyle} />
              <View className="py-4 bg-red-500">
                <View className="w-full flex-row items-center gap-4 border border-neutral-400 rounded-xl px-5 py-4 bg-white">
                  <Search size={18} color="black" strokeWidth={3} />
                  <TextInput
                    className="flex-1 py-1"
                    placeholderTextColor="gray"
                    placeholder="Search destinations"
                  />
                </View>
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-1 px-6"
        contentContainerStyle={undefined}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </Animated.View>
  );
};

export default WhereSection;
