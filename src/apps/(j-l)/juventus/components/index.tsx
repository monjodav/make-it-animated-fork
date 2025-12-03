import { Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useAnimatedRef,
  scrollTo,
  useAnimatedReaction,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useMemo, useState } from "react";
import MonthItem from "./month-item";
import { getMonths, getMonthWeeks } from "../lib/utils";
import MonthDatesItem from "./month-dates-item";
import {
  DATE_CELL_SIZE,
  DAYS,
  MOCK_GAMES,
  MONTHS_GAP,
  MONTHS_OVERLAY_SCROLL_HEIGHT,
} from "../lib/constants";
import GameCard from "./game-card";
import { scheduleOnRN } from "react-native-worklets";

const Calendar = () => {
  const { width: screenWidth } = useWindowDimensions();

  const months = getMonths();

  const [monthWidths, setMonthWidths] = useState<number[]>([]);

  const [activeMonthIndex, setActiveMonthIndex] = useState(0);

  const scrollOffsetX = useSharedValue(0);
  const activeIndexProgress = useSharedValue(0);

  const scrollMonthsRef = useAnimatedRef<Animated.ScrollView>();
  const scrollDatesRef = useAnimatedRef<Animated.ScrollView>();
  const scrollDatesOverlayRef = useAnimatedRef<Animated.ScrollView>();
  const scrollGamesRef = useAnimatedRef<Animated.ScrollView>();
  const syncing = useSharedValue(false);

  // Track active month index for games display
  useAnimatedReaction(
    () => activeIndexProgress.get(),
    (current) => {
      const rounded = Math.round(current);
      if (activeMonthIndex !== rounded) {
        scheduleOnRN(setActiveMonthIndex, rounded);
      }
    }
  );

  // Filter games for the currently visible month
  const activeMonthGames = useMemo(() => {
    if (activeMonthIndex >= months.length) return [];
    const activeMonth = months[activeMonthIndex];
    return MOCK_GAMES.filter(
      (game) =>
        game.date.getMonth() === activeMonth.date.getMonth() &&
        game.date.getFullYear() === activeMonth.date.getFullYear()
    );
  }, [activeMonthIndex, months]);

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
      scrollTo(scrollDatesOverlayRef, offsetX, 0, false);
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
      scrollTo(scrollDatesRef, offsetX, 0, false);
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

    const progress = activeIndexProgress.get();
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

  const rGamesStyle = useAnimatedStyle(() => {
    const progress = activeIndexProgress.get();
    const frac = progress - Math.floor(progress);
    const opacity = interpolate(frac, [0, 0.3, 0.7, 1], [1, 0, 0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  // Handle date click to scroll to corresponding game
  const handleDatePress = (date: Date) => {
    const gameIndex = activeMonthGames.findIndex(
      (game) =>
        game.date.getDate() === date.getDate() &&
        game.date.getMonth() === date.getMonth() &&
        game.date.getFullYear() === date.getFullYear()
    );

    if (gameIndex !== -1 && scrollGamesRef.current) {
      // Each game card is 280px wide + margin
      const GAME_CARD_WIDTH = 280 + 12; // width + margin-right
      const scrollOffset = gameIndex * GAME_CARD_WIDTH;
      scrollGamesRef.current.scrollTo({ x: scrollOffset, animated: true });
    }
  };

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
            ref={scrollDatesOverlayRef}
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
          ref={scrollDatesRef}
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
                games={MOCK_GAMES}
                onDatePress={handleDatePress}
              />
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* Games horizontal scroll for active month */}
      <Animated.View style={rGamesStyle}>
        {activeMonthGames.length > 0 ? (
          <Animated.ScrollView
            ref={scrollGamesRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ marginHorizontal: 16 }}
          >
            {activeMonthGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </Animated.ScrollView>
        ) : (
          <View className="bg-white self-center rounded-2xl p-4 mr-3 w-[280px] h-[120px] justify-center">
            <Text className="text-red-500 text-3xl text-center">
              No official matches available this month
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default Calendar;
