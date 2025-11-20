import { Pressable, View } from "react-native";
import { FC } from "react";
import { LayoutGrid, List } from "lucide-react-native";
import { useAnimationsStore } from "../../lib/store/animations";

const Switcher: FC = () => {
  const viewMode = useAnimationsStore((state) => state.viewMode);
  const setViewMode = useAnimationsStore((state) => state.setViewMode);

  return (
    <View className="flex-row items-center gap-5 self-end mt-1">
      <Pressable onPress={() => setViewMode("list")}>
        <List size={25} strokeWidth={3} color={viewMode === "list" ? "#ffffff" : "#a8a29e"} />
      </Pressable>
      <Pressable onPress={() => setViewMode("grid")}>
        <LayoutGrid size={25} color={viewMode === "grid" ? "#ffffff" : "#a8a29e"} />
      </Pressable>
    </View>
  );
};

export default Switcher;
