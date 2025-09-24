import { HardDriveUpload } from "lucide-react-native";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useScrollContext } from "@/src/apps/(a-c)/app-store/lib/providers/scroll-provider";
import { APP_STORE_CONSTANTS } from "@/src/apps/(a-c)/app-store/lib/constants/animation-config";
import { useHeaderHeight } from "@react-navigation/elements";

const CONTENT_DISAPPEAR_OFFSET = APP_STORE_CONSTANTS.CONTENT_DISAPPEAR_OFFSET;

export const App = () => {
  const headerHeight = useHeaderHeight();

  const scrollY = useSharedValue(0);
  const { setScrollY } = useScrollContext();

  useEffect(() => {
    setScrollY(scrollY);
  }, [scrollY, setScrollY]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const shouldShowContent = useDerivedValue(() => {
    return scrollY.value < CONTENT_DISAPPEAR_OFFSET - 30;
  });

  const appContentStyle = useAnimatedStyle(() => {
    const opacity = withTiming(shouldShowContent.value ? 1 : 0, {
      duration: 300,
    });

    return {
      opacity,
    };
  });

  return (
    <View className="flex-1 bg-black">
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerHeight }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[{ paddingHorizontal: 24, flexDirection: "row", gap: 10 }, appContentStyle]}
        >
          <View className="h-[120] w-[120] bg-white rounded-[20]" />
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">App Title</Text>
            <Text className="text-white text-lg font-bold">Description</Text>
            <View className="flex-row justify-between mt-auto">
              <View className="bg-blue-600 rounded-full px-4 py-1">
                <Text className="text-white text-base font-bold">Open</Text>
              </View>
              <HardDriveUpload size={24} color="#007AFF" />
            </View>
          </View>
        </Animated.View>

        <View className="px-5 pt-3">
          {Array.from({ length: 20 }).map((_, index) => (
            <View key={index} className="p-5 mb-2 bg-neutral-900 rounded-lg" />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};
