import { FlatList, Text, View } from "react-native";
import React, { FC } from "react";
import { User } from "@sentry/react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "expo-image";

type StoriesItemProps = {
  item: User;
  scrollRef: React.RefObject<FlatList<User> | null>;
  index: number;
  indexProgress: SharedValue<number>;
  width: number;
};

const UserItem: FC<StoriesItemProps> = ({ item, index, indexProgress, width, scrollRef }) => {
  const rStyle = useAnimatedStyle(() => {
    const currentIdx = Math.floor(indexProgress.value);
    const progress = indexProgress.value - currentIdx;

    if (index === currentIdx) {
      // Current slide rotating out
      const rotateY = interpolate(progress, [0, 1], [0, -90], Extrapolation.CLAMP);
      const translateX = interpolate(progress, [0, 1], [0, -width / 10000], Extrapolation.CLAMP);

      return {
        transformOrigin: "right",
        transform: [{ perspective: 2000 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    if (index === currentIdx + 1) {
      // Next slide rotating in
      const rotateY = interpolate(progress, [0, 1], [90, 0], Extrapolation.CLAMP);
      const translateX = interpolate(progress, [0, 1], [width / 10000, 0], Extrapolation.CLAMP);

      return {
        transformOrigin: "left",
        transform: [{ perspective: 2000 }, { translateX }, { rotateY: `${rotateY}deg` }],
      };
    }

    return {};
  });

  return (
    <Animated.View style={[{ width }, rStyle]}>
      <Image
        contentFit="cover"
        placeholder={{ blurhash: item.stories[0].image }}
        style={{ width: "100%", height: "100%", borderRadius: 10 }}
      />

      <View className="p-3 border border-white bg-black/30 absolute bottom-4 left-4 right-4 rounded-full">
        <Text className="text-lg text-white">Send message ...</Text>
      </View>
    </Animated.View>
  );
};

export default UserItem;
