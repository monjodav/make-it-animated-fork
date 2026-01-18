// juventus-games-calendar-animation 🔽

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  scrollTo,
  withTiming,
} from "react-native-reanimated";
import { useCallback } from "react";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { Pressable, useWindowDimensions } from "react-native";
import { MONTHS_HEIGHT } from "../../lib/constants";
import { MonthLabel } from "./month-label";

type MonthsProps = {
  data: { label: string; date: Date }[];
};

export const Months = ({ data }: MonthsProps) => {
  const { activeIndexProgress, monthWidths, scrollViewRef } = use(CalendarAnimatedContext);

  const { width: screenWidth } = useWindowDimensions();

  // Half screen width used to center active month label
  const screenWidthHalf = screenWidth / 2;

  // Input range for interpolation: [0, 1, 2, ...] corresponding to month indices
  const inputRange = data.map((_, index) => index);

  // Pre-compute width indices array once - avoids Object.keys().map() on every frame
  // Since widths is an array, we can use indices directly
  const widthIndices = inputRange;

  // Derived value that recalculates ONLY when monthWidths changes (not on every frame)
  // Pre-computes cumulative widths and output range to avoid expensive array operations during swipe
  const cumulativeWidthsData = useDerivedValue(() => {
    const widths = monthWidths.get();

    // Build cumulative width array: [0, width[0], width[0]+width[1], ...]
    // Used to calculate total horizontal offset needed to center each month
    const cumulativeWidths: number[] = [];
    for (let i = 0; i < widths.length; i++) {
      const previousSum = i === 0 ? 0 : cumulativeWidths[i - 1];
      cumulativeWidths[i] = previousSum + widths[i];
    }

    return {
      widths,
      outputRange: [0, ...cumulativeWidths],
    };
  });

  // Derived value recalculates only when activeIndexProgress or monthWidths change
  // More efficient than recalculating in useAnimatedStyle on every frame
  // Uses pre-computed cumulative widths data to minimize per-frame calculations
  const translateX = useDerivedValue(() => {
    const progress = activeIndexProgress.get();
    const { widths, outputRange } = cumulativeWidthsData.get();

    // Interpolate current month's width based on scroll progress
    // Input: progress (e.g., 2.5 = between month 2 and 3)
    // Output: interpolated width at that progress point
    // Enables smooth width transitions as user scrolls between months
    // Uses pre-computed widthIndices instead of Object.keys().map() on every frame
    const centerItemWidth = interpolate(progress, widthIndices, widths);

    // Center the active month: screen center minus half of month width
    const initialTranslateX = screenWidthHalf - centerItemWidth / 2;

    // Base translation: moves container left as progress increases
    // progress * screenWidth accounts for scroll-based offset
    const baseTranslateX = initialTranslateX + progress * screenWidth;

    // Correction factor: accounts for variable month label widths
    // Without this, months with different widths wouldn't center correctly
    // Clamp prevents extrapolation beyond array bounds
    // Uses pre-computed outputRange instead of rebuilding on every frame
    const itemCorrection = interpolate(progress, inputRange, outputRange, Extrapolation.CLAMP);

    // Final translation: base offset minus correction for variable widths
    return baseTranslateX - itemCorrection;
  });

  const rMonthsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.get() }],
    };
  });

  // Programmatic scroll to specific month - triggered on month label press
  // Uses pagingEnabled to snap to exact screen width boundaries
  const scrollToIndex = useCallback(
    (index: number) => {
      const scrollToOffset = index * screenWidth;
      // activeIndexProgress.set(withTiming(index, { duration: 200 }));
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: scrollToOffset, animated: true });
      }, 0);
    },
    [screenWidth, scrollViewRef]
  );

  return (
    <Animated.View
      className="absolute top-0 left-0 flex-row items-center"
      style={[{ height: MONTHS_HEIGHT }, rMonthsStyle]}
    >
      {data.map((month, index) => (
        <Pressable
          key={index.toString()}
          onPress={() => scrollToIndex(index)}
          className="px-3"
          // Measure actual rendered width of each month label
          // Required because text widths vary (e.g., "September" vs "May")
          // Updates shared value array to enable accurate centering calculations
          onLayout={(e) => {
            const { width } = e.nativeEvent.layout;
            monthWidths.modify((value) => {
              "worklet";
              value[index] = width;
              return value;
            });
          }}
        >
          <MonthLabel label={month.label} index={index} />
        </Pressable>
      ))}
    </Animated.View>
  );
};

// juventus-games-calendar-animation 🔼
