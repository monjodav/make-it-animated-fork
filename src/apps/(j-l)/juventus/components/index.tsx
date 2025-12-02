import { Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useAnimatedRef,
  scrollTo,
} from "react-native-reanimated";
import { useState } from "react";
import MonthItem from "./month-item";
import { getMonths, getMonthWeeks } from "../lib/utils";
import MonthDatesItem from "./month-dates-item";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS_GAP = 30;
const DATE_CELL_SIZE = 35;
const MONTHS_OVERLAY_SCROLL_HEIGHT = 40;

const Calendar = () => {
  const { width: screenWidth } = useWindowDimensions();

  const months = getMonths();

  const [monthWidths, setMonthWidths] = useState<number[]>([]);

  const scrollOffsetX = useSharedValue(0);
  const activeIndexProgress = useSharedValue(0);

  const scrollMonthsRef = useAnimatedRef<Animated.ScrollView>();
  const scrollDatesRef1 = useAnimatedRef<Animated.ScrollView>();
  const scrollDatesRef2 = useAnimatedRef<Animated.ScrollView>();
  const syncing = useSharedValue(false);

  useDerivedValue(() => {
    if (monthWidths.length === months.length && monthWidths.every((w) => w > 0)) {
      const progress = activeIndexProgress.get();
      const gap = MONTHS_GAP;
      const leftPad = (screenWidth - monthWidths[0]) / 2;

      // First month center
      const firstMonthOffset = leftPad + monthWidths[0] / 2 - screenWidth / 2;
      // Last month center
      let lastMonthCenter = leftPad + gap * (months.length - 1);
      for (let i = 0; i < months.length - 1; i++) {
        lastMonthCenter += monthWidths[i];
      }
      const lastMonthOffset =
        lastMonthCenter + monthWidths[monthWidths.length - 1] / 2 - screenWidth / 2;

      let offset;
      if (progress <= 0) {
        offset = firstMonthOffset;
      } else if (progress >= months.length - 1) {
        offset = lastMonthOffset;
      } else {
        const leftIndex = Math.floor(progress);
        const rightIndex = Math.min(leftIndex + 1, monthWidths.length - 1);
        const interp = progress - leftIndex;

        // Interpolate offset between centers of left and right month
        let leftCenter = leftPad + gap * leftIndex;
        for (let i = 0; i < leftIndex; i++) {
          leftCenter += monthWidths[i];
        }
        leftCenter += monthWidths[leftIndex] / 2 - screenWidth / 2;

        let rightCenter = leftPad + gap * rightIndex;
        for (let i = 0; i < rightIndex; i++) {
          rightCenter += monthWidths[i];
        }
        rightCenter += monthWidths[rightIndex] / 2 - screenWidth / 2;

        offset = leftCenter + interp * (rightCenter - leftCenter);
      }
      scrollTo(scrollMonthsRef, offset, 0, false);
    }
  });

  const scrollHandlerDates1 = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (syncing.get()) return;
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      activeIndexProgress.set(offsetX / screenWidth);
      syncing.set(true);
      scrollTo(scrollDatesRef2, offsetX, 0, false);
      queueMicrotask(() => {
        syncing.set(false);
      });
    },
  });
  const scrollHandlerDates2 = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (syncing.get()) return;
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      activeIndexProgress.set(offsetX / screenWidth);
      syncing.set(true);
      scrollTo(scrollDatesRef1, offsetX, 0, false);
      queueMicrotask(() => {
        syncing.set(false);
      });
    },
  });

  const rRedLineStyle = useAnimatedStyle(() => {
    // Guard until widths are measured
    if (monthWidths.length === 0) {
      return { width: 0 };
    }

    const progress = activeIndexProgress.value;
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

  return (
    <View>
      <View className="items-center">
        <Animated.ScrollView
          ref={scrollMonthsRef}
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
                activeIndexProgress={activeIndexProgress}
              />
            ))}
          </View>
        </Animated.ScrollView>

        <View style={{ height: MONTHS_OVERLAY_SCROLL_HEIGHT }} className="absolute">
          <Animated.ScrollView
            ref={scrollDatesRef2}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={scrollHandlerDates2}
            scrollEventThrottle={16}
          >
            <View className="flex-row">
              {months.map((monthObj, idx) => {
                return (
                  <View
                    key={`${monthObj.label}-${idx}`}
                    style={{ width: screenWidth }}
                    className="px-4"
                  />
                );
              })}
            </View>
          </Animated.ScrollView>
        </View>
      </View>

      <Animated.View className="h-1 self-center bg-red-700" style={rRedLineStyle} />

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

      <View className="items-center mt-6">
        <Animated.ScrollView
          ref={scrollDatesRef1}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={scrollHandlerDates1}
          scrollEventThrottle={16}
        >
          {months.map((monthObj, idx) => {
            const weeks = getMonthWeeks(monthObj);
            return (
              <MonthDatesItem
                key={`${monthObj.label}-${idx}`}
                screenWidth={screenWidth}
                weeks={weeks}
                dateCellSize={DATE_CELL_SIZE}
              />
            );
          })}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default Calendar;
