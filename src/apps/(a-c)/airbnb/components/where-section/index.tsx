import { useScrollViewOffset } from "@/src/shared/lib/hooks/use-scroll-view-offset";
import { StyleSheet, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOP_POSITION = 150;
const BOTTOM_POSITION = 300;
const SIDE_POSITION = 16;

const WhereSection = () => {
  const insets = useSafeAreaInsets();

  const { scrollOffsetY, scrollHandler } = useScrollViewOffset();

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
          borderRadius: 30,
        },
        rFlatListContainerStyle,
      ]}
    >
      <Animated.FlatList
        data={Array.from({ length: 50 }).map((_, i) => i)}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center gap-4 py-2">
            <View className="h-14 w-14 rounded-xl bg-cyan-300" />
            <View className="flex-1 gap-1">
              <View className="h-5 w-50 rounded-full bg-neutral-500" />
              <View className="h-5 w-50 rounded-full bg-neutral-300" />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-1 px-5"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </Animated.View>
  );
};

export default WhereSection;
