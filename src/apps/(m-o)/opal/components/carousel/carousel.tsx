import { Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import CarouselItem from "./carousel-item";

const DATA = [
  {
    id: 1,
    title: "🕯️ Laser Focus",
    description: "Your daily focus hour from 2-3pm, Weekdays",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 2,
    title: "🌅 Rise & Shine",
    description: "Wake up without distraction 6-9am Daily",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 3,
    title: "🚀 Creative",
    description: "Protect your energy 10-11am Weekdays",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 4,
    title: "🕯️ Laser Focus",
    description: "Your daily focus hour from 2-3pm, Weekdays",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 5,
    title: "🌅 Rise & Shine",
    description: "Wake up without distraction 6-9am Daily",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: 6,
    title: "🚀 Creative",
    description: "Protect your energy 10-11am Weekdays",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];

const ITEM_WIDTH = 150;
const ITEM_MARGIN = 10;
const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;

const Carousel = () => {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="mt-32 px-5"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      {DATA.map((item, index) => (
        <CarouselItem
          key={item.id}
          item={item}
          index={index}
          scrollX={scrollX}
          itemSize={ITEM_SIZE}
          screenWidth={SCREEN_WIDTH}
          horizontalPadding={HORIZONTAL_PADDING}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default Carousel;
