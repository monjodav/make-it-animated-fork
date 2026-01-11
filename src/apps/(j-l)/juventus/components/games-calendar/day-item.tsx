import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { DATE_CELL_SIZE, Game } from "../../lib/constants";

type DayItemProps = {
  weeks: (Date | null)[][];
  games: Game[];
  onDatePress?: (date: Date) => void;
};

export const DayItem = ({ weeks, games, onDatePress }: DayItemProps) => {
  const { width: screenWidth } = useWindowDimensions();

  // Helper to check if a date has a game
  const hasGame = (date: Date | null) => {
    if (!date) return false;
    return games.some(
      (game) =>
        game.date.getDate() === date.getDate() &&
        game.date.getMonth() === date.getMonth() &&
        game.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <View style={{ width: screenWidth }} className="px-4">
      {weeks.map((week, wIdx) => (
        <View key={wIdx} className="flex-row justify-between mb-1">
          {week.map((date, dIdx) => {
            const isGameDay = hasGame(date);
            return (
              <View
                key={dIdx}
                className="items-center justify-center"
                style={{ width: DATE_CELL_SIZE, height: DATE_CELL_SIZE }}
              >
                {date ? (
                  <TouchableOpacity
                    onPress={() => isGameDay && onDatePress?.(date)}
                    disabled={!isGameDay}
                    activeOpacity={isGameDay ? 0.6 : 1}
                  >
                    <View className="relative items-center justify-center">
                      {isGameDay && (
                        <View
                          className="absolute rounded-full border-2 border-red-700"
                          style={{
                            width: DATE_CELL_SIZE - 4,
                            height: DATE_CELL_SIZE - 4,
                          }}
                        />
                      )}
                      <Text className="text-white text-lg font-semibold text-center">
                        {date.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};
