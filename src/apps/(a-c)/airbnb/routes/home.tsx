import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WhereSection from "../components/where-section";

const Home = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-200" style={{ paddingTop: insets.top }}>
      <WhereSection />
    </View>
  );
};

export default Home;
