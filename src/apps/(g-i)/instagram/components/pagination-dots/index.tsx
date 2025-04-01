import React, { memo, type FC } from "react";
import { View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Dot, {
  _dotContainerWidth,
  _dotSize,
  _duration,
  _numberOfDots,
  _visibleDotsWidth,
} from "./dot";
import { Indicator } from "./indicator";
import { useImageCarousel } from "../../lib/providers/image-carousel-provider";

export type ScrollType = "left" | "idle" | "right";

type Props = {
  defaultDotColor?: string;
  activeDotColor?: string;
};

const PaginationDots: FC<Props> = ({ defaultDotColor = "gray", activeDotColor = "white" }) => {
  const { activeImageIndex, prevImageIndex, totalImages } = useImageCarousel();

  const indicatorIndex = useSharedValue(0);
  const scroll = useSharedValue<ScrollType>("idle");

  const setScrollToIdle = () => {
    setTimeout(() => {
      scroll.value = "idle";
    }, _duration);
  };

  useAnimatedReaction(
    () => ({
      activeImageIndex: activeImageIndex.value,
      prevImageIndex: prevImageIndex.value,
    }),
    ({ activeImageIndex, prevImageIndex }) => {
      if (scroll.value !== "idle") return;

      if (activeImageIndex > prevImageIndex && indicatorIndex.value === 2) {
        scroll.value = "right";
        runOnJS(setScrollToIdle)();
      }
      if (activeImageIndex < prevImageIndex && indicatorIndex.value === 0) {
        scroll.value = "left";
        runOnJS(setScrollToIdle)();
      }
      if (activeImageIndex > prevImageIndex && indicatorIndex.value < 2) {
        indicatorIndex.value += activeImageIndex - prevImageIndex;
      }
      if (activeImageIndex < prevImageIndex && indicatorIndex.value > 0) {
        indicatorIndex.value -= prevImageIndex - activeImageIndex;
      }
    }
  );

  const outerTranslateX = useSharedValue(0);
  const innerTranslateX = useSharedValue(0);

  const rDotsContainer = useAnimatedStyle(() => {
    // Translate manipulation to handle start of the list
    if (activeImageIndex.value === 0) {
      outerTranslateX.value = withTiming(2 * _dotContainerWidth, {
        duration: _duration,
      });
    }

    if (
      activeImageIndex.value === 3 &&
      prevImageIndex.value === 2 &&
      outerTranslateX.value === 2 * _dotContainerWidth
    ) {
      outerTranslateX.value = withTiming(_dotContainerWidth, {
        duration: _duration,
      });
    }

    if (
      activeImageIndex.value === 4 &&
      prevImageIndex.value === 3 &&
      outerTranslateX.value === _dotContainerWidth
    ) {
      outerTranslateX.value = withTiming(0, { duration: _duration });
    }

    if (activeImageIndex.value === 1 && prevImageIndex.value === 2 && outerTranslateX.value === 0) {
      outerTranslateX.value = withTiming(_dotContainerWidth, {
        duration: _duration,
      });
    }

    // Translate manipulation to handle end of the list
    // If the list is in range 5-7 items I'm handling the end of the list by dot opacity
    if (totalImages > 7) {
      if (activeImageIndex.value === totalImages - 1) {
        outerTranslateX.value = withTiming(-2 * _dotContainerWidth, {
          duration: _duration,
        });
      }

      if (activeImageIndex.value === totalImages - 2 && prevImageIndex.value === totalImages - 3) {
        outerTranslateX.value = withTiming(-_dotContainerWidth, {
          duration: _duration,
        });
      }

      if (activeImageIndex.value === totalImages - 4 && prevImageIndex.value === totalImages - 5) {
        outerTranslateX.value = withTiming(0, { duration: _duration });
      }

      if (
        activeImageIndex.value === totalImages - 4 &&
        prevImageIndex.value === totalImages - 3 &&
        outerTranslateX.value === -2 * _dotContainerWidth
      ) {
        outerTranslateX.value = withTiming(-_dotContainerWidth, {
          duration: _duration,
        });
      }

      if (
        activeImageIndex.value === totalImages - 5 &&
        prevImageIndex.value === totalImages - 4 &&
        outerTranslateX.value === -_dotContainerWidth
      ) {
        outerTranslateX.value = withTiming(0, { duration: _duration });
      }
    }

    return {
      transform: [{ translateX: outerTranslateX.value }],
    };
  });

  const rDotsTranslateContainer = useAnimatedStyle(() => {
    // Translate manipulation to handle start of the list
    if (activeImageIndex.value === 0) {
      innerTranslateX.value = withTiming(-2 * _dotContainerWidth, {
        duration: _duration,
      });
    }

    if (
      activeImageIndex.value === 3 &&
      prevImageIndex.value === 2 &&
      innerTranslateX.value === -2 * _dotContainerWidth
    ) {
      innerTranslateX.value = withTiming(-_dotContainerWidth, {
        duration: _duration,
      });
    }

    if (
      activeImageIndex.value === 4 &&
      prevImageIndex.value === 3 &&
      innerTranslateX.value === -_dotContainerWidth
    ) {
      innerTranslateX.value = withTiming(0, { duration: _duration });
    }

    if (activeImageIndex.value === 1 && prevImageIndex.value === 2 && innerTranslateX.value === 0) {
      innerTranslateX.value = withTiming(-_dotContainerWidth, {
        duration: _duration,
      });
    }

    // Translate manipulation to handle end of the list
    // If the list is in range 5-7 items I'm handling the end of the list by dot opacity
    if (totalImages > 7) {
      if (activeImageIndex.value === totalImages - 1) {
        innerTranslateX.value = withTiming(2 * _dotContainerWidth, {
          duration: _duration,
        });
      }

      if (activeImageIndex.value === totalImages - 2 && prevImageIndex.value === totalImages - 3) {
        innerTranslateX.value = withTiming(_dotContainerWidth, {
          duration: _duration,
        });
      }

      if (activeImageIndex.value === totalImages - 4 && prevImageIndex.value === totalImages - 5) {
        innerTranslateX.value = withTiming(0, { duration: _duration });
      }

      if (
        activeImageIndex.value === totalImages - 4 &&
        prevImageIndex.value === totalImages - 3 &&
        innerTranslateX.value === 2 * _dotContainerWidth
      ) {
        innerTranslateX.value = withTiming(_dotContainerWidth, {
          duration: _duration,
        });
      }

      if (
        activeImageIndex.value === totalImages - 5 &&
        prevImageIndex.value === totalImages - 4 &&
        innerTranslateX.value === _dotContainerWidth
      ) {
        innerTranslateX.value = withTiming(0, { duration: _duration });
      }
    }

    return {
      transform: [{ translateX: innerTranslateX.value }],
    };
  });

  if (totalImages < 2) {
    return <></>;
  }

  if (totalImages > 1 && totalImages < 6) {
    return (
      <View
        className="flex-row"
        style={{ width: totalImages * _dotContainerWidth, height: _dotSize }}
      >
        {Array.from({ length: totalImages }).map((_, i) => (
          <Dot key={i} index={i} defaultDotColor={defaultDotColor} />
        ))}
        <Indicator
          activeDotColor={activeDotColor}
          indicatorIndex={activeImageIndex}
          scroll={scroll}
        />
      </View>
    );
  }

  return (
    <View>
      <Animated.View
        className="overflow-hidden"
        style={[rDotsContainer, { width: _visibleDotsWidth, height: _dotSize }]}
      >
        <Animated.View style={rDotsTranslateContainer}>
          {Array.from({ length: _numberOfDots }).map((_, i) => (
            <Dot key={i} index={i} scroll={scroll} defaultDotColor={defaultDotColor} />
          ))}
        </Animated.View>
      </Animated.View>
      <Indicator activeDotColor={activeDotColor} indicatorIndex={indicatorIndex} scroll={scroll} />
    </View>
  );
};

export default memo(PaginationDots);
