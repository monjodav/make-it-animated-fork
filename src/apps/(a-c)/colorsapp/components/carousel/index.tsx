import React, { FC } from "react";

import { FlatList, StyleSheet, View } from "react-native";

import { CarouselItem } from "./carousel-item";

// colorsapp-card-blurry-circles-animation 🔽

type CarouselCard = {
  color: "primary" | "secondary" | "tertiary";
  text1: string;
  text2: string;
  colorAnimationVariant: 1 | 2 | 3;
};

// Static copy for showcase. Order alternates color + variant to keep rotations/desync interesting.
const DATA: CarouselCard[] = [
  {
    color: "primary",
    text1: "Test",
    text2: "your ideas",
    colorAnimationVariant: 1,
  },
  {
    color: "tertiary",
    text1: "Find",
    text2: "the right color",
    colorAnimationVariant: 2,
  },
  {
    color: "secondary",
    text1: "Express",
    text2: "your creativity",
    colorAnimationVariant: 3,
  },
  {
    color: "primary",
    text1: "Explore",
    text2: "the possibilities",
    colorAnimationVariant: 1,
  },
  {
    color: "secondary",
    text1: "Capture",
    text2: "your audience",
    colorAnimationVariant: 2,
  },
];

export const Carousel: FC = () => {
  return (
    <FlatList<CarouselCard>
      horizontal
      data={DATA}
      renderItem={({ item, index }) => (
        <>
          <CarouselItem
            color={item.color}
            text1={item.text1}
            text2={item.text2}
            colorAnimationVariant={item.colorAnimationVariant}
          />
          {index !== DATA.length - 1 && <View className="w-3" />}
        </>
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 16,
  },
});

// colorsapp-card-blurry-circles-animation 🔼
