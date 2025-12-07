import { useWindowDimensions } from "react-native";
import { useRef } from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { USERS } from "../../lib/data/users";
import UserStoriesItem from "./user-stories-item";

// instagram-stories-carousel-animation 🔽

const StoriesCarousel = () => {
  const { width } = useWindowDimensions();

  const scrollRef = useRef<Animated.FlatList>(null);

  const animatedIndex = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      animatedIndex.set(event.contentOffset.x / width);
    },
    onMomentumEnd: (event) => {
      currentIndex.set(Math.round(event.contentOffset.x / width));
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
          animatedIndex={animatedIndex}
          currentIndex={currentIndex}
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
