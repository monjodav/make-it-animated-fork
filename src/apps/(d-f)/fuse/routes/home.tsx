import React, { FC, useEffect, useState } from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Coins } from "../components/coins";
import { NFTs } from "../components/nfts";
import { Dashboard } from "../components/dashboard";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ContentBlur } from "../components/content-blur";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { HomeListItemContainer } from "../components/home-list-item-container";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type TabValue = "dashboard" | "coins" | "nfts";

type Tab = {
  value: TabValue;
  content: React.ReactNode;
};

const tabs: Tab[] = [
  { value: "dashboard", content: <Dashboard /> },
  { value: "coins", content: <Coins /> },
  { value: "nfts", content: <NFTs /> },
];

type Props = {};

export const Home: FC<Props> = ({}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const listOffsetX = useSharedValue(0);

  const blurAnimatedProps = useAnimatedProps(() => {
    const intensity = interpolate(
      listOffsetX.value,
      [
        currentTabIndex * width,
        currentTabIndex * width + width / 2,
        currentTabIndex * width + width,
      ],
      [0, 50, 0],
      Extrapolation.CLAMP
    );

    return {
      intensity,
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listOffsetX.value = event.contentOffset.x;
    },
  });

  const _renderItem = ({ item, index }: { item: Tab; index: number }) => {
    return (
      <HomeListItemContainer index={index} listOffsetX={listOffsetX}>
        {item.content}
      </HomeListItemContainer>
    );
  };

  return (
    <View className="flex-1 bg-neutral-200" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center px-7">
        <View className="flex-1 flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-neutral-300" />
          <View className="gap-1.5">
            <View className="w-12 h-4 rounded-full bg-neutral-300" />
            <View className="w-20 h-3 rounded-full bg-neutral-300" />
          </View>
        </View>
        <View className="w-6 h-6 rounded-full border-[2px] border-neutral-300" />
      </View>
      <View className="flex-1">
        <Animated.FlatList
          data={tabs}
          renderItem={_renderItem}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces={false}
          onMomentumScrollEnd={() => {
            setCurrentTabIndex(Math.round(listOffsetX.value / width));
          }}
        />
        {/* <AnimatedBlurView
          style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
          animatedProps={blurAnimatedProps}
        /> */}
      </View>
    </View>
  );
};
