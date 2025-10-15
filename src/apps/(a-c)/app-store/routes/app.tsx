import { Upload } from "lucide-react-native";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { useScrollContext } from "@/src/apps/(a-c)/app-store/lib/providers/scroll-provider";
import { APP_STORE_CONSTANTS } from "@/src/apps/(a-c)/app-store/lib/constants/animation-config";
import AppImage from "@/assets/images/icon-ios.png";
import { Image } from "expo-image";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

const CONTENT_DISAPPEAR_OFFSET = APP_STORE_CONSTANTS.CONTENT_DISAPPEAR_OFFSET;

export const App = () => {
  const headerHeight = useHeaderHeight();
  const { scrollY } = useScrollContext();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y);
    },
  });

  const shouldShowContent = useDerivedValue(() => {
    return scrollY.get() < CONTENT_DISAPPEAR_OFFSET - 30;
  });

  const appContentStyle = useAnimatedStyle(() => {
    const opacity = withTiming(shouldShowContent.get() ? 1 : 0, {
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
        contentContainerStyle={{ paddingTop: headerHeight + 12 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View className="px-6 flex-row gap-[10px]" style={appContentStyle}>
          <Image source={AppImage} style={styles.image} />
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Make It Animated</Text>
            <Text className="text-neutral-500 text-lg">Developer Tools</Text>
            <View className="flex-row justify-between mt-auto">
              <Pressable className="bg-blue-600 rounded-full px-4 py-1" onPress={simulatePress}>
                <Text className="text-white text-lg font-bold">Open</Text>
              </Pressable>
              <Upload size={24} color="#007AFF" />
            </View>
          </View>
        </Animated.View>

        <View className="px-5 pt-3">
          <View className="p-10 mb-4 bg-neutral-900 rounded-lg" />
          <View className="p-3 w-[100] mb-3 bg-neutral-900 rounded-lg" />
          <View className="p-3 w-[190] mb-8 bg-neutral-900 rounded-lg" />
          <View className="p-10 w-[190] mb-4 bg-neutral-900 rounded-lg" />
          {Array.from({ length: 17 }).map((_, index) => (
            <View key={index} className="p-5 mb-2 bg-neutral-900 rounded-lg" />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    borderRadius: 28,
    borderCurve: "continuous",
  },
});
