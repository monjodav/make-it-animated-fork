import { useWindowDimensions, ViewToken } from "react-native";
import { useRef, useState, useCallback } from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { USERS } from "../../lib/data/users";
import UserStoriesItem from "./user-stories-item";
import { User } from "../../lib/data/users";

// instagram-stories-carousel-animation 🔽

const StoriesCarousel = () => {
  const [listCurrentIndex, setListCurrentIndex] = useState(0);

  const { width } = useWindowDimensions();

  const scrollRef = useRef<Animated.FlatList<User> | null>(null);

  const listAnimatedIndex = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 0,
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setListCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isDragging.set(true);
    },
    onScroll: (event) => {
      listAnimatedIndex.set(event.contentOffset.x / width);
    },
    onEndDrag: () => {
      isDragging.set(false);
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
          isDragging={isDragging}
          scrollRef={scrollRef}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      pagingEnabled
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
};

export default StoriesCarousel;

// instagram-stories-carousel-animation 🔼
