import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Messages() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black px-4" style={{ paddingTop: insets.top + 16 }}>
      <View className="w-[80%] h-6 rounded-md bg-neutral-900 mb-2" />
      <View className="w-[70%] h-3 rounded-md bg-neutral-900 mb-1" />
      <View className="w-[65%] h-3 rounded-md bg-neutral-900 mb-6" />
      <View className="w-[50%] h-12 rounded-full border border-neutral-800" />
    </View>
  );
}
