import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";

const MonthIndicator = () => {
  const { monthWidths, activeIndexProgress } = use(CalendarAnimatedContext);
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    // Guard until widths are measured
    if (monthWidths.length === 0) {
      return { width: 0 };
    }

    const progress = activeIndexProgress.get();
    const lastIdx = monthWidths.length - 1;

    // Clamp progress to valid range
    const clamped = Math.max(0, Math.min(progress, lastIdx));
    const leftIndex = Math.floor(clamped);
    const rightIndex = Math.min(leftIndex + 1, lastIdx);
    const t = clamped - leftIndex;

    // Interpolate width between left and right month
    const leftW = monthWidths[leftIndex] ?? 0;
    const rightW = monthWidths[rightIndex] ?? leftW;
    const width = leftW + t * (rightW - leftW);

    return { width };
  });

  return <Animated.View className="h-1 self-center bg-red-700" style={animatedIndicatorStyle} />;
};

export default MonthIndicator;
