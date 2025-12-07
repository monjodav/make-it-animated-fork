import { useWindowDimensions } from "react-native";
import { useRef } from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { USERS } from "../../lib/data/users";
import UserStoriesItem from "./user-stories-item";

// instagram-stories-carousel-animation 🔽

const StoriesCarousel = () => {
  const { width } = useWindowDimensions();

  const scrollRef = useRef<Animated.FlatList>(null);

  const listAnimatedIndex = useSharedValue(0);
  const listCurrentIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listAnimatedIndex.set(event.contentOffset.x / width);
    },
    onMomentumEnd: (event) => {
      listCurrentIndex.set(Math.round(event.contentOffset.x / width));
    },
  });

  return (
    <Animated.FlatList
      ref={scrollRef}
      data={USERS}
      renderItem={({ item, index }) => (
        <UserStoriesItem
          user={item}
          userIndex={index}
          totalUsers={USERS.length}
          listAnimatedIndex={listAnimatedIndex}
          listCurrentIndex={listCurrentIndex}
          scrollRef={scrollRef}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      pagingEnabled
    />
  );
};

export default StoriesCarousel;

// instagram-stories-carousel-animation 🔼
