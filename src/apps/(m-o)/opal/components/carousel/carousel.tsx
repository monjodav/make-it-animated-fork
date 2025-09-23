import { Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import CarouselItem from "./carousel-item";

const DATA = [
  {
    id: 1,
    title: "🕯️ Laser Focus",
    description: "Your daily focus hour from 2-3pm, Weekdays",
    blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH",
  },
  {
    id: 2,
    title: "🌅 Rise & Shine",
    description: "Wake up without distraction 6-9am Daily",
    blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6.",
  },
  {
    id: 3,
    title: "🚀 Creative",
    description: "Protect your energy 10-11am Weekdays",
    blurhash: "LEHLh[WB2yk8pyoJadR*.7kCMdnj",
  },
  {
    id: 4,
    title: "🕯️ Laser Focus",
    description: "Your daily focus hour from 2-3pm, Weekdays",
    blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH",
  },
  {
    id: 5,
    title: "🌅 Rise & Shine",
    description: "Wake up without distraction 6-9am Daily",
    blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
  },
  {
    id: 6,
    title: "🚀 Creative",
    description: "Protect your energy 10-11am Weekdays",
    blurhash: "LKN]Rv%2Tw=w]~RBVZRi};RPxuwH",
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 15;

const AVAILABLE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const TARGET_ITEMS_CENTERED = 2;
const PARTIAL_ITEM_VISIBLE_RATIO = 0.15;

const TOTAL_VISIBLE_RATIO = TARGET_ITEMS_CENTERED + PARTIAL_ITEM_VISIBLE_RATIO * 2;
const ITEM_WIDTH = AVAILABLE_WIDTH / TOTAL_VISIBLE_RATIO;
const ITEM_MARGIN = 10;
const ITEM_SIZE = ITEM_WIDTH + ITEM_MARGIN;

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
          itemWidth={ITEM_WIDTH}
          itemMargin={ITEM_MARGIN}
          screenWidth={SCREEN_WIDTH}
          horizontalPadding={HORIZONTAL_PADDING}
        />
      ))}
    </Animated.ScrollView>
  );
};

export default Carousel;
