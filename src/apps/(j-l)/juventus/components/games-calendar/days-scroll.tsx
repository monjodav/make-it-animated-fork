import { View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useAnimatedReaction } from "react-native-reanimated";
import { useCallback, useMemo, useState, use } from "react";
import { scheduleOnRN } from "react-native-worklets";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { getMonths, getMonthWeeks } from "../../lib/utils";
import { MOCK_GAMES } from "../../lib/constants";
import { DayItem } from "./day-item";

const DaysScroll = () => {
  // State
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);

  // Data-related variables
  const { width: screenWidth } = useWindowDimensions();
  const { daysScrollRef, gamesScrollRef, scrollOffsetX, activeIndexProgress } =
    use(CalendarAnimatedContext);
  const months = getMonths();

  // Hooks
  const updateActiveMonthIndex = useCallback((index: number) => {
    setActiveMonthIndex(index);
  }, []);

  useAnimatedReaction(
    () => Math.round(activeIndexProgress.get()),
    (currentIndex) => {
      scheduleOnRN(updateActiveMonthIndex, currentIndex);
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

  // Animation-related logic and styles
  const daysScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetX = event.contentOffset.x;
      scrollOffsetX.set(offsetX);
      activeIndexProgress.set(offsetX / screenWidth);
    },
  });

  // Callbacks
  const handleDatePress = useCallback(
    (date: Date) => {
      const gameIndex = activeMonthGames.findIndex(
        (game) =>
          game.date.getDate() === date.getDate() &&
          game.date.getMonth() === date.getMonth() &&
          game.date.getFullYear() === date.getFullYear()
      );

      if (gameIndex !== -1 && gamesScrollRef.current) {
        // Each game card is 280px wide + margin
        const GAME_CARD_WIDTH = 280 + 12; // width + margin-right
        const scrollOffset = gameIndex * GAME_CARD_WIDTH;
        gamesScrollRef.current.scrollTo({ x: scrollOffset, animated: true });
      }
    },
    [activeMonthGames, gamesScrollRef]
  );

  return (
    <View className="items-center mt-6">
      <Animated.ScrollView
        ref={daysScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={daysScrollHandler}
        scrollEventThrottle={16}
      >
        {months.map((monthObj, idx) => {
          const weeks = getMonthWeeks(monthObj);
          return (
            <DayItem
              key={`${monthObj.label}-${idx}`}
              weeks={weeks}
              games={MOCK_GAMES}
              onDatePress={handleDatePress}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default DaysScroll;
