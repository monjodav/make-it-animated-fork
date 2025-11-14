import { Ellipsis } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

export const createMockData = (length: number): number[] => Array.from({ length });

export const renderListItem = () => (
  <View className="px-4">
    <View className="flex-row justify-between items-center my-2">
      <View className="w-24 h-4 bg-neutral-400 rounded-full" />
      <Ellipsis size={18} color="grey" />
    </View>
    <View
      style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "grey",
      }}
    />
    <View className="w-36 h-4 bg-neutral-400 rounded-full mt-3" />
    <View className="h-60 w-full rounded-lg bg-neutral-400 my-3" />
  </View>
);
