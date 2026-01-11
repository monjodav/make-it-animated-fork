import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";

const MonthIndicator = () => {
  const { monthWidths, activeIndexProgress } = use(CalendarAnimatedContext);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const width = interpolate(
      activeIndexProgress.get(),
      Object.keys(monthWidths.get()).map(Number),
      monthWidths.get()
    );

    return { width };
  });

  return <Animated.View className="h-1 self-center bg-red-700" style={animatedIndicatorStyle} />;
};

export default MonthIndicator;
