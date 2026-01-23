import { useWindowDimensions, View } from "react-native";
import React from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import CarouselItem from "./carousel-item";
import { PaginationDots } from "./pagination-dots";

const SLIDES = [
  { id: "1", blurhash: "ekGPMmjusUS5WV{@j[jHShW;S$WEoeShS5AMbIS4W=SPkDWXW.aiWZ" },
  { id: "2", blurhash: "eWAwf=s;tAnhRhGKI[I_obV?TewaxtoLxVWes.RiJEX9aLNLs%s.bd" },
  { id: "3", blurhash: "ebR]8HkCxtn5S3Y%j[xFaeR*bHaebbaKV[qvkCVtWWjFnOi_WXWVnj" },
  { id: "4", blurhash: "eiGSDsoeb;R*x.~HjIS^batLnmRUbboJjG9RWGRlt3VxIvNKs:s+aM" },
  { id: "5", blurhash: "e57.0^kU03RX~mT5WF04-m-.R*Ip^{IYIa06?X-.V[9I9HD-_0M}D+" },
];

const Carousel = () => {
  const { width } = useWindowDimensions();

  const activeIndex = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x;
    activeIndex.set(offsetX / width);
  });

  return (
    <View>
      <Animated.FlatList
        horizontal
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarouselItem item={item} width={width} />}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="pt-8"
        onScroll={scrollHandler}
      />
      <View className="pt-12">
        <PaginationDots numberOfDots={SLIDES.length} activeIndex={activeIndex} />
      </View>
    </View>
  );
};

export default Carousel;