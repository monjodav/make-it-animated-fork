import { useWindowDimensions, View } from "react-native";
import Animated from "react-native-reanimated";
import { use } from "react";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { getMonths } from "../../lib/utils";
import { MONTHS_GAP } from "../../lib/constants";
import MonthItem from "./month-item";

const MonthsScroll = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { monthsScrollRef, monthWidths, setMonthWidths } = use(CalendarAnimatedContext);
  const months = getMonths();

  return (
    <View className="h-9">
      <Animated.ScrollView
        ref={monthsScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: (screenWidth - monthWidths[0]) / 2,
          paddingRight: (screenWidth - monthWidths[monthWidths.length - 1]) / 2,
        }}
        scrollEventThrottle={16}
      >
        <View className="flex-row" style={{ gap: MONTHS_GAP }}>
          {months.map((month, idx) => (
            <MonthItem
              key={idx.toString()}
              month={month}
              idx={idx}
              setMonthWidths={setMonthWidths}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default MonthsScroll;
