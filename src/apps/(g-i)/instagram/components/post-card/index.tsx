import { FC } from "react";
import { Carousel, CarouselContent, CarouselPagination } from "../carousel";
import { View, Text } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { Description } from "./description";
import { Post } from "../../lib/types";

// instagram-pagination-dots-animation 🔽

type Props = {
  index: number;
  width: number;
  post: Post;
};

export const PostCard: FC<Props> = ({ index, width, post }: Props) => {
  return (
    <Animated.View
      layout={LinearTransition.springify().damping(28).stiffness(260)}
      className="mb-20"
    >
      <Carousel key={index} images={post.images}>
        <CarouselContent
          width={width}
          renderItem={({ item }) => (
            <View
              className="bg-neutral-900 items-center justify-center aspect-square"
              style={{ width }}
            >
              <Text className="text-neutral-600 text-5xl">{item}</Text>
            </View>
          )}
        />
        <View className="p-3 items-center">
          <CarouselPagination />
        </View>
      </Carousel>
      <View className="px-4">
        {/* instagram-post-truncated-text-animation 🔽 */}
        <Description text={post.description} numberOfLines={2} />
        {/* instagram-post-truncated-text-animation 🔼 */}
      </View>
    </Animated.View>
  );
};

// instagram-pagination-dots-animation 🔼
