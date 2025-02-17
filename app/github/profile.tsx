import { View, Text } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, { useAnimatedRef, useScrollViewOffset } from "react-native-reanimated";
import { useHeaderBackground } from "@/hooks/github/use-header-background";
import { useHeaderTitle } from "@/hooks/github/use-header-title";

export default function Profile() {
  const headerHeight = useHeaderHeight();

  const listRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffsetY = useScrollViewOffset(listRef);

  useHeaderBackground({ offsetY: scrollOffsetY });
  const { triggerRef, isTriggerMounted } = useHeaderTitle({ offsetY: scrollOffsetY });

  return (
    <Animated.ScrollView
      ref={listRef}
      className="flex-1 bg-black"
      contentContainerClassName="px-5"
      contentContainerStyle={{ paddingTop: headerHeight + 16 }}
      scrollEventThrottle={1000 / 60}
      indicatorStyle="white"
    >
      <View className="flex-row items-center gap-4">
        <View className="w-20 h-20 rounded-full bg-neutral-900" />
        <View className="flex-1">
          <Text className="text-stone-100 font-bold text-lg">Volodymyr Serbulenko</Text>
          <Animated.Text
            ref={triggerRef}
            className="text-stone-300 text-base"
            onLayout={() => {
              if (isTriggerMounted.get() === false) {
                isTriggerMounted.set(true);
              }
            }}
          >
            vvv-sss
          </Animated.Text>
        </View>
      </View>
    </Animated.ScrollView>
  );
}
