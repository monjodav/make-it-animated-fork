import { Pressable, View } from "react-native";
import { FC } from "react";
import { LayoutGrid, List } from "lucide-react-native";
import { simulatePress } from "../../lib/utils/simulate-press";

const Switcher: FC = () => {
  return (
    <View className="flex-row items-center gap-5 self-end mt-1">
      <Pressable onPress={simulatePress}>
        <List size={25} strokeWidth={3} color="#a8a29e" />
      </Pressable>
      <Pressable onPress={simulatePress}>
        <LayoutGrid size={25} color="#a8a29e" />
      </Pressable>
    </View>
  );
};

export default Switcher;
