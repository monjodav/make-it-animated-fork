import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { MONTHS_HEIGHT } from "../../lib/constants";

const MonthIndicator = () => {
  const { monthWidths, activeIndexProgress } = use(CalendarAnimatedContext);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const width = interpolate(
      activeIndexProgress.get(),
      Object.keys(monthWidths.get()).map(Number),
      monthWidths.get().map((width) => width - 12)
    );

    return { width };
  });

  return (
    <Animated.View
      className="absolute h-1 self-center bg-red-700"
      style={[{ top: MONTHS_HEIGHT }, animatedIndicatorStyle]}
    />
  );
};

export default MonthIndicator;
