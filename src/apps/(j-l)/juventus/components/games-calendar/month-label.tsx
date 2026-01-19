// juventus-games-calendar-animation 🔽

import Animated, {
} from "react-native-reanimated";

type MonthLabelProps = {
  label: string;
  index: number;
};

export const MonthLabel = ({ label }: MonthLabelProps) => {
  return (
    <Animated.Text className="text-neutral-100 text-2xl font-bold uppercase">
      {label}
    </Animated.Text>
  );
};

// juventus-games-calendar-animation 🔼
