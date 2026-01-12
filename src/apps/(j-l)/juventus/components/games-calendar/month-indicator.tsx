// juventus-games-calendar-animation 🔽

import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { MONTHS_HEIGHT } from "../../lib/constants";

const MonthIndicator = () => {
  const { monthWidths, activeIndexProgress } = use(CalendarAnimatedContext);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    // Width interpolation: indicator width matches active month label width
    // Input: progress values [0, 1, 2, ...] corresponding to month indices
    // Output: month widths minus 12px padding (visual spacing from text edges)
    // Creates smooth width transition as user scrolls between months
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

// juventus-games-calendar-animation 🔼
