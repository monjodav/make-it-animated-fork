// juventus-games-calendar-animation 🔽

import { Text, useWindowDimensions, View } from "react-native";
import { CalendarAnimatedProvider } from "../../lib/animated-context";
import { DATE_CELL_SIZE, DAYS, MONTHS_HEIGHT, DAYS_HEADER_HEIGHT } from "../../lib/constants";
import MonthIndicator from "./month-indicator";
import { ScrollContainer } from "./scroll-container";
import { getMonths } from "../../lib/utils";
import { Months } from "./months";
import { Days } from "./days";

// Pre-compute calendar data once at module level - avoids recalculation on re-renders
const CALENDAR_DATA = getMonths();

export const GamesCalendar = () => {
  const { width: screenWidth } = useWindowDimensions();

  return (
    <CalendarAnimatedProvider>
      <View>
        <ScrollContainer>
          {/* Months row: absolutely positioned, animated via translateX */}
          <Months data={CALENDAR_DATA} />
          {/* Days grid: one full-screen-width container per month */}
          {/* screenWidth ensures pagingEnabled snaps correctly */}
          {CALENDAR_DATA.map((month, index) => (
            <View key={index.toString()} style={{ width: screenWidth }}>
              <Days data={month} />
            </View>
          ))}
        </ScrollContainer>
        {/* Indicator bar: width interpolates to match active month label */}
        <MonthIndicator />
        {/* Fixed day headers: absolute positioned above scroll content */}
        {/* top: MONTHS_HEIGHT positions below month labels row */}
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

// juventus-games-calendar-animation 🔼
