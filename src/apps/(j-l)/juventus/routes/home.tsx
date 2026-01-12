import { View } from "react-native";
import { GamesCalendar } from "../components/games-calendar";
import { Header } from "../components/header";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";

// juventus-games-calendar-animation 🔽

const Home = () => {
  useAndroidNote(
    "Scroll-based animations on Android devices may appear jumpy. This is a known issue in React Native that many developers are actively working to resolve. We are monitoring related issue tickets and will continue to improve the implementation as solutions become available."
  );

  return (
    <View className="flex-1 bg-black">
      <Header />
      <GamesCalendar />
    </View>
  );
};

// juventus-games-calendar-animation 🔼

export default Home;
