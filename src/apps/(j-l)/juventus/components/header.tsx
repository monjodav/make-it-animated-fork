import { View } from "react-native";
import { Menu, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { JuventusLogo } from "./logo";
import { AdidasLogo } from "./adidas-logo";
import { JeepLogo } from "./jeep-logo";

export const Header = () => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View className="mb-12" style={{ paddingTop: safeAreaInsets.top }}>
      <View className="flex-row items-center justify-between px-4 py-3 mb-10">
        <Menu size={24} color="white" />
        <JuventusLogo width={40} height={40} />
        <User size={24} color="white" />
      </View>
      <View className="flex-row items-center justify-center px-4 pb-3 gap-12">
        <AdidasLogo width={60} height={35} />
        <JeepLogo width={65} height={40} />
      </View>
    </View>
  );
};
