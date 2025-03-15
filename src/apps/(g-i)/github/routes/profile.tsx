import { View, Text } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, { useAnimatedRef, useScrollViewOffset } from "react-native-reanimated";
import { useHeaderBackground } from "../lib/use-header-background";
import { useHeaderTitle } from "../lib/use-header-title";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// github-profile-header-title-animation 🔽

export default function Profile() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const listRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffsetY = useScrollViewOffset(listRef);

  useHeaderBackground({ offsetY: scrollOffsetY });

  const { triggerRef, onLayout } = useHeaderTitle({
    offsetY: scrollOffsetY,
    title: "vvv-sss",
  });

  return (
    <Animated.ScrollView
      ref={listRef}
      className="flex-1 bg-black"
      contentContainerClassName="px-5"
      contentContainerStyle={{ paddingTop: headerHeight + 16, paddingBottom: insets.bottom }}
      scrollEventThrottle={1000 / 60}
      indicatorStyle="white"
    >
      <View className="flex-row items-center gap-4 mb-6">
        <View className="w-20 h-20 rounded-full border border-white/15" />
        <View className="flex-1">
          <Text className="text-stone-100 font-bold text-lg">Volodymyr Serbulenko</Text>
          <Animated.View ref={triggerRef} onLayout={onLayout}>
            <Animated.Text className="text-stone-300 text-base">vvv-sss</Animated.Text>
          </Animated.View>
        </View>
      </View>

      <View className="w-full h-12 bg-neutral-900 rounded-xl mb-6" />

      <View className="w-3/4 h-4 bg-neutral-900 rounded-md mb-1" />
      <View className="w-1/2 h-4 bg-neutral-900 rounded-md mb-4" />

      <View className="w-32 h-4 bg-neutral-900 rounded-md mb-4" />

      <View className="flex-row items-center gap-1 mb-6">
        <View className="w-4 h-4 rounded-full bg-neutral-900" />
        <View className="w-16 h-4 bg-neutral-900 rounded-md" />
        <View className="w-4 h-4 rounded-full bg-neutral-900" />
        <View className="w-20 h-4 bg-neutral-900 rounded-md" />
      </View>
      <View className="gap-[2px] mb-10">
        <View className="w-full h-12 bg-neutral-900 rounded-lg" />
        <View className="w-full h-12 bg-neutral-900 rounded-lg" />
        <View className="w-full h-12 bg-neutral-900 rounded-lg" />
      </View>
      <View className="w-1/3 h-4 bg-neutral-900 rounded-md mb-4" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
    </Animated.ScrollView>
  );
}

// github-profile-header-title-animation 🔼
