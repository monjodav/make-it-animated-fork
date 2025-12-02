import { FC } from "react";
import { Text, View } from "react-native";
import { Game } from "../lib/constants";

type MonthDatesItemProps = {
  screenWidth: number;
  weeks: Array<Array<Date | null>>;
  dateCellSize: number;
  games: Game[];
};

const MonthDatesItem: FC<MonthDatesItemProps> = ({ screenWidth, weeks, dateCellSize, games }) => {
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
                style={{ width: dateCellSize, height: dateCellSize }}
              >
                {date ? (
                  <View className="relative items-center justify-center">
                    {isGameDay && (
                      <View
                        className="absolute rounded-full border-2 border-red-700"
                        style={{
                          width: dateCellSize - 4,
                          height: dateCellSize - 4,
                        }}
                      />
                    )}
                    <Text className="text-white text-lg font-semibold text-center">
                      {date.getDate()}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default MonthDatesItem;
