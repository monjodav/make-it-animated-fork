import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  Extrapolation,
  useAnimatedReaction,
  useAnimatedRef,
  scrollTo,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import { useRef, useState } from "react";
import { scheduleOnRN } from "react-native-worklets";

// Generate months: 12 before now, current, 6 after
function getMonths(): { label: string; date: Date }[] {
  const now = new Date();
  const months: { label: string; date: Date }[] = [];
  for (let i = -12; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = d.toLocaleString("default", {
      month: "long",
      //  year: "numeric"
    });
    months.push({ label, date: d });
  }
  return months;
}

function getMonthWeeks(monthObj: { label: string; date: Date }) {
  const year = monthObj.date.getFullYear();
  const month = monthObj.date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDayIdx = firstDay.getDay();
  startDayIdx = startDayIdx === 0 ? 6 : startDayIdx - 1;
  const daysInMonth = lastDay.getDate();
  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i));
  }
  // Build weeks: each week is an array of 7 items (dates or null)
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = Array(startDayIdx).fill(null);
  dates.forEach((date) => {
    week.push(date);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

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
      className="text-3xl font-semibold uppercase"
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS_GAP = 30;

const Calendar = () => {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const months = getMonths();

  const [monthWidths, setMonthWidths] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollOffsetX = useSharedValue(0);
  const activeIndexProgress = useSharedValue(0);

  const scrollMonthsRef = useAnimatedRef<Animated.ScrollView>();
  const scrollDatesRef = useRef<Animated.ScrollView | null>(null);

  useDerivedValue(() => {
    if (monthWidths.length === months.length && monthWidths.every((w) => w > 0)) {
      const progress = activeIndexProgress.get();
      const gap = MONTHS_GAP;
      const leftPad = (screenWidth - monthWidths[0]) / 2;
      const rightPad = (screenWidth - monthWidths[monthWidths.length - 1]) / 2;

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

  useAnimatedReaction(
    () => activeIndexProgress.get(),
    (current, _) => {
      const rounded = Math.round(current);

      if (Math.abs(current - rounded) < 0.01 && activeIndex !== rounded) {
        scheduleOnRN(setActiveIndex, rounded);
      }
    }
  );

  const scrollHandlerMonths = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x;
  });

  const scrollHandlerDates = useAnimatedScrollHandler((event) => {
    const offsetX = event.contentOffset.x;
    scrollOffsetX.set(offsetX);
    activeIndexProgress.set(offsetX / screenWidth);
  });

  const rRedLineStyle = useAnimatedStyle(() => {
    if (activeIndexProgress.get() <= 0) {
      return {
        width: monthWidths[0],
      };
    }
    if (activeIndexProgress.get() >= monthWidths.length - 1) {
      return {
        width: monthWidths[monthWidths.length - 1],
      };
    }
    const width = interpolate(
      activeIndexProgress.get(),
      [activeIndex - 1, activeIndex, activeIndex + 1],
      [monthWidths[activeIndex - 1], monthWidths[activeIndex], monthWidths[activeIndex + 1]],
      Extrapolation.CLAMP
    );
    return {
      width,
    };
  });

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <View className="items-center mt-[100px]">
        <Animated.ScrollView
          ref={scrollMonthsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: (screenWidth - monthWidths[0]) / 2,
            paddingRight: (screenWidth - monthWidths[monthWidths.length - 1]) / 2,
          }}
          onScroll={scrollHandlerMonths}
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
      </View>

      <Animated.View className="h-1 self-center bg-red-700" style={rRedLineStyle} />

      <View className="flex-row justify-between px-4 mt-[40px]">
        {DAYS.map((day) => (
          <Text key={day} className="w-[35px] font-semibold uppercase text-neutral-500 text-center">
            {day}
          </Text>
        ))}
      </View>

      <View className="items-center mt-[20px]">
        <Animated.ScrollView
          ref={scrollDatesRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}
          pagingEnabled
          onScroll={scrollHandlerDates}
          scrollEventThrottle={16}
        >
          <View className="flex-row">
            {months.map((monthObj, idx) => {
              const weeks = getMonthWeeks(monthObj);
              return (
                <View
                  key={`${monthObj.label}-${idx}`}
                  style={{ width: screenWidth }}
                  className="px-4 border bg-yellow-300"
                >
                  {weeks.map((week, wIdx) => (
                    <View key={wIdx} className="flex-row justify-between mb-1">
                      {week.map((date, dIdx) => (
                        <View key={dIdx} className="h-[35px] w-[35px] items-center justify-center">
                          {date ? (
                            <Text className="text-base text-gray-900 text-center">
                              {date.getDate()}
                            </Text>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </Animated.ScrollView>
      </View>
    </View>
  );
};

export default Calendar;
