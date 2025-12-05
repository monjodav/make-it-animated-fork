import { useWindowDimensions } from "react-native";
import { useRef } from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { USERS } from "../../lib/data/users";
import UserItem from "./user-item";

const UsersCarousel = () => {
  const { width } = useWindowDimensions();

  const scrollRef = useRef<Animated.FlatList>(null);

  const indexUserProgress = useSharedValue(0);
  const activeUserIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      indexUserProgress.set(event.contentOffset.x / width);
    },
    onMomentumEnd: (event) => {
      activeUserIndex.set(Math.round(event.contentOffset.x / width));
    },
  });

  return (
    <Animated.FlatList
      ref={scrollRef}
      data={USERS}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <UserItem
          userItem={item}
          userIndex={index}
          indexUserProgress={indexUserProgress}
          width={width}
          activeUserIndex={activeUserIndex}
          scrollRef={scrollRef}
          totalUsers={USERS.length}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      pagingEnabled
      contentContainerClassName="bg-black"
    />
  );
};

export default UsersCarousel;
