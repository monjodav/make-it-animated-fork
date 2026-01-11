import { View } from "react-native";
import Animated from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { getMonths } from "../../lib/utils";
import { MONTHS_GAP } from "../../lib/constants";
import MonthItem from "./month-item";

const MonthsScroll = () => {
  const { monthsScrollRef } = use(CalendarAnimatedContext);
  const months = getMonths();

  return (
    <View className="h-9">
      <Animated.ScrollView
        ref={monthsScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View className="flex-row" style={{ gap: MONTHS_GAP }}>
          {months.map((month, idx) => (
            <MonthItem key={idx.toString()} month={month} idx={idx} />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default MonthsScroll;
