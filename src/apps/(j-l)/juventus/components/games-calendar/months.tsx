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
  const { activeIndexProgress, monthWidths, isMonthPressed, scrollViewRef } =
    use(CalendarAnimatedContext);

  const { width: screenWidth } = useWindowDimensions();

  const screenWidthHalf = screenWidth / 2;

  const inputRange = data.map((_, index) => index);

  const translateX = useDerivedValue(() => {
    const progress = activeIndexProgress.get();
    const widths = monthWidths.get();

    // Calculate center item width using interpolation
    const centerItemWidth = interpolate(progress, Object.keys(widths).map(Number), widths);

    // Calculate cumulative widths for item correction
    const cumulativeWidths: number[] = [];
    for (let i = 0; i < widths.length; i++) {
      const previousSum = i === 0 ? 0 : cumulativeWidths[i - 1];
      cumulativeWidths[i] = previousSum + widths[i];
    }
    const outputRange = [0, ...cumulativeWidths];

    // Calculate initial translateX
    const initialTranslateX = screenWidthHalf - centerItemWidth / 2;

    // Calculate base translateX
    const baseTranslateX = initialTranslateX + progress * screenWidth;

    // Calculate item correction
    const itemCorrection = interpolate(progress, inputRange, outputRange, Extrapolation.CLAMP);

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
          onPressIn={() => isMonthPressed.set(true)}
          onPressOut={() => isMonthPressed.set(false)}
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
