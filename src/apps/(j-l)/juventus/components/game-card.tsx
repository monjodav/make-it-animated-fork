import { FC } from "react";
import { Text, View } from "react-native";
import { Game } from "../lib/constants";

type GameCardProps = {
  game: Game;
};

const GameCard: FC<GameCardProps> = ({ game }) => {
  return (
    <View className="bg-white rounded-2xl p-4 mr-3 w-[280px] h-[120px]">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-red-500 text-xs font-semibold uppercase tracking-wider">
          {game.competition}
        </Text>
        <View className="px-2 py-1">
          <Text className="text-xs font-semibold">{game.homeAway.toUpperCase()}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-black text-2xl mb-1">Juventus</Text>
          <Text className="text-black text-2xl">{game.opponent}</Text>
        </View>

        <View className="items-end">
          <View className="flex-row items-center ml-4">
            <Text className="text-black text-3xl font-semibold">
              {String(game.date.getDate()).padStart(2, "0")}.
              {String(game.date.getMonth() + 1).padStart(2, "0")}
            </Text>
          </View>
          <Text className="text-blackfont-semibold">00:59</Text>
        </View>
      </View>
    </View>
  );
};

export default GameCard;
