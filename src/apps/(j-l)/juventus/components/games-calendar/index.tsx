import { Text, View } from "react-native";
import { CalendarAnimatedProvider } from "../../lib/animated-context";
import { DATE_CELL_SIZE, DAYS } from "../../lib/constants";
import MonthIndicator from "./month-indicator";
import MonthsScroll from "./months-scroll";
import DaysScroll from "./days-scroll";
import GamesScroll from "./games-scroll";

export const GamesCalendar = () => {
  return (
    <CalendarAnimatedProvider>
      <MonthsScroll />
      <MonthIndicator />
      <View className="flex-row justify-between px-4 mt-6">
        {DAYS.map((day) => (
          <Text
            key={day}
            className="font-semibold uppercase text-neutral-500 text-center"
            style={{ width: DATE_CELL_SIZE }}
          >
            {day}
          </Text>
        ))}
      </View>
      <DaysScroll />
      <GamesScroll />
    </CalendarAnimatedProvider>
  );
};
