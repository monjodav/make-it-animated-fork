import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
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

  const centerItemWidth = useDerivedValue(() => {
    return interpolate(
      activeIndexProgress.get(),
      Object.keys(monthWidths.get()).map(Number),
      monthWidths.get()
    );
  });

  const inputRange = data.map((_, index) => index);
  const outputRange = useDerivedValue(() => {
    const cumulativeWidths = monthWidths
      .get()
      .reduce((acc: number[], width: number, index: number) => {
        const previousSum = index === 0 ? 0 : acc[index - 1];
        return [...acc, previousSum + width];
      }, []);
    return [0, ...cumulativeWidths];
  });

  const translateX = useDerivedValue(() => {
    const initialTranslateX = screenWidth / 2 - centerItemWidth.get() / 2;

    const baseTranslateX = interpolate(
      activeIndexProgress.get(),
      [0, 1],
      [initialTranslateX, initialTranslateX + screenWidth]
    );

    const itemCorrection = interpolate(
      activeIndexProgress.get(),
      inputRange,
      outputRange.get(),
      Extrapolation.CLAMP
    );

    return baseTranslateX - itemCorrection;
  });

  const rMonthsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.get() }],
    };
  });

  const scrollToIndex = useCallback(
    (index: number) => {
      const scrollToOffset = index * screenWidth;
      scrollViewRef.current?.scrollTo({ x: scrollToOffset, animated: true });
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
