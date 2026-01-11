import { View } from "react-native";
import { GamesCalendar } from "../components/games-calendar";

const Home = () => {
  return (
    <View className="flex-1 bg-black pt-[200px]">
      <GamesCalendar />
    </View>
  );
};

export default Home;
