import { View } from "react-native";
import UsersCarousel from "../components/users-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-black">
      <UsersCarousel />
    </View>
  );
}
