import React, { type FC } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Dot, _dotContainerWidth } from "./dot";
import { useImageCarousel } from "../../lib/providers/image-carousel-provider";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { colorKit } from "reanimated-color-picker";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const _containerDefaultBgColor = colorKit.setAlpha("#fff", 0).hex();
const _containerPressedBgColor = colorKit.setAlpha("#fff", 0.1).hex();

type Props = {
  defaultDotColor?: string;
  activeDotColor?: string;
};

export const PaginationDots: FC<Props> = ({
  defaultDotColor = "gray",
  activeDotColor = "white",
}) => {
  const {
    images,
    imageIndex,
    setImageIndex,
    carouselRef,
    dotsListRef,
    isDotsPressed,
    setIsDotsPressed,
  } = useImageCarousel();

  const listOffsetX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      listOffsetX.value = event.contentOffset.x;
    },
  });

  const translateXStep = images.length > 10 ? 12 : 15;

  const prevTranslateX = useSharedValue(0);

  const handleImageIndexChange = (action: "increase" | "decrease") => {
    const index = action === "increase" ? imageIndex + 1 : imageIndex - 1;

    if (index < 0 || index >= images.length) {
      return;
    }

    setImageIndex(index);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (index >= 0 && index < images.length) {
      carouselRef.current?.scrollToIndex({
        animated: false,
        index,
      });
    }
  };

  const handleFinalize = () => {
    if (!isDotsPressed) {
      return;
    }

    setIsDotsPressed(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      prevTranslateX.value = 0;
    })
    .onUpdate((event) => {
      if (!isDotsPressed) {
        return;
      }

      const translateX = event.translationX;

      if (translateX - prevTranslateX.value > translateXStep) {
        runOnJS(handleImageIndexChange)("increase");
        prevTranslateX.value = translateX;
      }

      if (translateX - prevTranslateX.value < -translateXStep) {
        runOnJS(handleImageIndexChange)("decrease");
        prevTranslateX.value = translateX;
      }
    })
    .onFinalize(() => {
      runOnJS(handleFinalize)();
    });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isDotsPressed ? _containerPressedBgColor : _containerDefaultBgColor,
        { duration: 150 }
      ),
    };
  });

  if (images.length === 1) {
    return <></>;
  }

  return (
    <GestureDetector gesture={gesture}>
      <AnimatedPressable
        className="bg-white/10 p-2 rounded-full"
        style={[styles.container, rContainerStyle]}
        onLongPress={() => {
          setIsDotsPressed(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        delayLongPress={200}
      >
        <View
          style={{
            width: _dotContainerWidth * (images.length > 5 ? 7 : images.length),
          }}
        >
          <Animated.FlatList
            ref={dotsListRef}
            // NOTE: we adding +4 dots to have 2 shallow dots on the left and 2 shallow dots on the right
            data={Array.from({ length: images.length > 5 ? images.length + 4 : images.length }).map(
              (_, index) => index
            )}
            renderItem={({ item }) => (
              <Dot
                index={item}
                listOffsetX={listOffsetX}
                // NOTE: we adding +2 as we have 2 shallow dots on the left
                isActive={images.length > 5 ? item === imageIndex + 2 : item === imageIndex}
                totalImages={images.length}
                defaultDotColor={defaultDotColor}
                activeDotColor={activeDotColor}
              />
            )}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          />
        </View>
      </AnimatedPressable>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});
