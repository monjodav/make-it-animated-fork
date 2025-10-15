import { View, Pressable } from "react-native";
import { LayoutGrid } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import BreathingIcon from "../components/breathing-icon";

export default function Chat() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-900">
      <View
        style={{ paddingTop: insets.top + 20 }}
        className="flex-row px-5 items-center justify-between"
      >
        <Pressable onPress={simulatePress}>
          <BreathingIcon />
        </Pressable>
        <LayoutGrid size={30} color="white" />
      </View>
    </View>
  );
}
