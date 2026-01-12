import { View } from "react-native";
import { GamesCalendar } from "../components/games-calendar";
import { Header } from "../components/header";

const Home = () => {
  return (
    <View className="flex-1 bg-black">
      <Header />
      <GamesCalendar />
    </View>
  );
};

export default Home;
