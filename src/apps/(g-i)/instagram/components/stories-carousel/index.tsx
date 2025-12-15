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

  // Continuous scroll position (can be fractional, e.g., 0.5 = halfway between cards)
  // Used by Container component to drive 3D rotation animations
  const listAnimatedIndex = useSharedValue(0);
  // Tracks scroll drag state to pause video playback during user interaction
  const isDragging = useSharedValue(false);

  // Viewability config: card must be 100% visible to be considered "viewable"
  // minimumViewTime: 0 ensures immediate index updates for responsive navigation
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

  // Animated scroll handler runs on UI thread for 60fps scroll tracking
  // Converts pixel offset to normalized index (0, 1, 2...) for animation calculations
  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isDragging.set(true);
    },
    // Normalize scroll position: contentOffset.x / width = current card index
    // Example: width=375px, offset=187.5px → index=0.5 (halfway between cards 0 and 1)
    onScroll: (event) => {
      listAnimatedIndex.set(event.contentOffset.x / width);
    },
    onEndDrag: () => {
      isDragging.set(false);
    },
  });

  // Animated.FlatList enables Reanimated scroll handlers to run on UI thread
  // See: https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
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
      // 16ms throttle ≈ 60fps scroll events for smooth animation updates
      // Lower values (e.g., 1ms) would be smoother but consume more CPU
      scrollEventThrottle={16}
      // Snaps to card boundaries for clean transitions
      pagingEnabled
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      decelerationRate="fast"
    />
  );
};

export default StoriesCarousel;

// instagram-stories-carousel-animation 🔼
