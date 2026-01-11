import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";

type MonthItemProps = {
  month: { label: string; date: Date };
  idx: number;
};

const MonthItem = ({ month, idx }: MonthItemProps) => {
  const { activeIndexProgress, monthWidths } = use(CalendarAnimatedContext);

  const rMonthStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      activeIndexProgress.get(),
      [idx - 1, idx, idx + 1],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );
    const color = interpolateColor(
      activeIndexProgress.get(),
      [idx - 1, idx, idx + 1],
      ["#888888", "#FFFFFF", "#888888"]
    );
    return {
      color,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.Text
      className="text-2xl font-semibold uppercase"
      style={rMonthStyle}
      onLayout={(e) => {
        const { width } = e.nativeEvent.layout;
        monthWidths.modify((value) => {
          "worklet";
          value[idx] = width;
          return value;
        });
      }}
    >
      {month.label}
    </Animated.Text>
  );
};
export default MonthItem;
