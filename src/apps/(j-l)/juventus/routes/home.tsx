import { View } from "react-native";
import { GamesCalendar } from "../components/games-calendar";
import { Header } from "../components/header";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";

// juventus-games-calendar-animation 🔽

const Home = () => {
  useAndroidNote("");

  return (
    <View className="flex-1 bg-black">
      <Header />
      <GamesCalendar />
    </View>
  );
};

// juventus-games-calendar-animation 🔼

export default Home;
