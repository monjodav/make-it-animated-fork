import { Pressable } from "react-native";
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
  setMonthWidths: React.Dispatch<React.SetStateAction<number[]>>;
};

const MonthItem = ({ month, idx, setMonthWidths }: MonthItemProps) => {
  const { activeIndexProgress } = use(CalendarAnimatedContext);
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
    <Pressable
      onPress={() => {
        activeIndexProgress.set(idx);
      }}
    >
      <Animated.Text
        className="text-2xl font-semibold uppercase"
        style={rMonthStyle}
        onLayout={(e) => {
          const { width } = e.nativeEvent.layout;
          setMonthWidths((prev) => {
            const newWidths = [...prev];
            newWidths[idx] = Math.round(width);
            return newWidths;
          });
        }}
      >
        {month.label}
      </Animated.Text>
    </Pressable>
  );
};
export default MonthItem;
