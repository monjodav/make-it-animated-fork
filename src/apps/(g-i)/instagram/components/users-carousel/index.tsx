import { useWindowDimensions } from "react-native";
import { useRef } from "react";
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { USERS } from "../../lib/data/users";
import UserItem from "./user-item";

const UsersCarousel = () => {
  const { width } = useWindowDimensions();

  const scrollRef = useRef<Animated.FlatList>(null);

  const scrollOffsetX = useSharedValue(0);

  const indexProgress = useSharedValue(0);
  const activeIndex = useSharedValue(0);

  useDerivedValue(() => {
    console.log("indexProgress:", indexProgress.value);
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffsetX.set(event.contentOffset.x);
      indexProgress.set(event.contentOffset.x / width);
    },
    onMomentumEnd: (event) => {
      activeIndex.set(Math.round(event.contentOffset.x / width));
    },
  });

  return (
    <Animated.FlatList
      ref={scrollRef}
      data={USERS}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <UserItem
          item={item}
          index={index}
          indexProgress={indexProgress}
          width={width}
          scrollRef={scrollRef}
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
