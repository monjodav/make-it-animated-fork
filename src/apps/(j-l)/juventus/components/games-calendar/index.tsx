import { Text, useWindowDimensions, View } from "react-native";
import { CalendarAnimatedProvider } from "../../lib/animated-context";
import { DATE_CELL_SIZE, DAYS, MONTHS_HEIGHT, DAYS_HEADER_HEIGHT } from "../../lib/constants";
import MonthIndicator from "./month-indicator";
import { ScrollContainer } from "./scroll-container";
import { getMonths } from "../../lib/utils";
import { Months } from "./months";
import { Days } from "./days";

const CALENDAR_DATA = getMonths();

export const GamesCalendar = () => {
  const { width: screenWidth } = useWindowDimensions();

  return (
    <CalendarAnimatedProvider>
      <View>
        <ScrollContainer>
          <Months data={CALENDAR_DATA} />
          {CALENDAR_DATA.map((month, index) => (
            <View key={index.toString()} style={{ width: screenWidth }}>
              <Days data={month} />
            </View>
          ))}
        </ScrollContainer>
        <MonthIndicator />
        <View
          style={{ height: DAYS_HEADER_HEIGHT, top: MONTHS_HEIGHT }}
          className="absolute w-full flex-row items-center justify-between px-4"
        >
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
      </View>
    </CalendarAnimatedProvider>
  );
};
