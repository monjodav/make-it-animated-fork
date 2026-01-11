import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
} from "react-native-reanimated";
import { useMemo, useState, useCallback, use } from "react";
import { scheduleOnRN } from "react-native-worklets";
import { CalendarAnimatedContext } from "../../lib/animated-context";
import { getMonths } from "../../lib/utils";
import { MOCK_GAMES } from "../../lib/constants";
import GameCard from "./game-card";

const GamesScroll = () => {
  // State
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);

  // Data-related variables
  const { gamesScrollRef, activeIndexProgress } = use(CalendarAnimatedContext);
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
  const rGamesStyle = useAnimatedStyle(() => {
    const progress = activeIndexProgress.get();
    const frac = progress - Math.floor(progress);
    const opacity = interpolate(frac, [0, 0.3, 0.7, 1], [1, 0, 0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <Animated.View style={rGamesStyle}>
      {activeMonthGames.length > 0 ? (
        <Animated.ScrollView
          ref={gamesScrollRef}
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
  );
};

export default GamesScroll;
