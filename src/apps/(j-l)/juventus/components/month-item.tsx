import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type MonthItemProps = {
  month: { label: string; date: Date };
  idx: number;
  setMonthWidths: React.Dispatch<React.SetStateAction<number[]>>;
  activeIndexProgress: SharedValue<number>;
};

const MonthItem = ({ month, idx, setMonthWidths, activeIndexProgress }: MonthItemProps) => {
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
      key={`${month.label}-${idx}`}
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
  );
};
export default MonthItem;
