// juventus-games-calendar-animation 🔽

import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";

type MonthLabelProps = {
  label: string;
  index: number;
};

export const MonthLabel = ({ label, index }: MonthLabelProps) => {
  const { activeIndexProgress } = use(CalendarAnimatedContext);

  const rTextStyle = useAnimatedStyle(() => {
    // Color interpolation: gray when inactive, white when active
    // Input range: [prevMonth, currentMonth, nextMonth]
    // Creates smooth color transition as user scrolls between months
    // Active month (index) gets white, neighbors fade to gray
    const color = interpolateColor(
      activeIndexProgress.get(),
      [index - 1, index, index + 1],
      ["#888888", "#FFFFFF", "#888888"]
    );

    // Scale interpolation: shrink inactive months, enlarge active month
    // Input: progress relative to this month's index
    // Output: scale values [0.8, 1.1, 0.8] for [prev, current, next]
    // CLAMP prevents extrapolation beyond range (keeps scale between 0.8-1.1)
    // Creates "pop" effect when month becomes active
    const scale = interpolate(
      activeIndexProgress.get(),
      [index - 1, index, index + 1],
      [0.8, 1.1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      color,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.Text style={rTextStyle} className="text-2xl font-bold uppercase">
      {label}
    </Animated.Text>
  );
};

// juventus-games-calendar-animation 🔼
