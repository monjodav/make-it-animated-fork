import { Pressable, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useLinearHeader } from "../lib/use-linear-header";
import LinearLogo from "@/assets/images/apps/linear.png";
import GithubLogo from "@/assets/images/apps/github.png";

const TITLE = "Home";

export default function Home() {
  const router = useRouter();

  const scrollY = useSharedValue(0);
  useLinearHeader({ offsetY: scrollY, title: TITLE });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y);
    },
  });

  const clickHandler = () => {
    router.push("/linear/home/dev-issues");
  };

  return (
    <View className="flex-1 bg-linear-back">
      <Animated.FlatList
        onScroll={scrollHandler}
        data={[]}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={() => null}
        ListEmptyComponent={() => {
          return (
            <View className="flex-1 px-4">
              <Text className="text-white text-3xl font-bold mt-2">{TITLE}</Text>
              <View className="h-4 w-2/5 mt-8 rounded-full bg-linear-front" />
              <View className="h-4 w-3/5 mt-8 rounded-full bg-linear-front" />
              <View className="h-4 w-2/6 mt-8 rounded-full bg-linear-front" />

              <Pressable className="flex-1 flex-row items-center gap-3 mt-7" onPress={clickHandler}>
                <Image
                  source={GithubLogo}
                  className="h-10 w-10 rounded-full"
                  resizeMode="contain"
                />
                <Text className="text-white text-lg font-semibold">DEV</Text>
              </Pressable>

              <Pressable className="flex-1 flex-row items-center gap-3 mt-5" onPress={clickHandler}>
                <Image
                  source={LinearLogo}
                  className="h-10 w-10 rounded-full"
                  resizeMode="contain"
                />
                <Text className="text-white text-lg font-semibold">make it animated</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}
