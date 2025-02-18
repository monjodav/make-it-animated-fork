import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Messages() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-x-back px-4" style={{ paddingTop: insets.top + 16 }}>
      <View className="w-[80%] h-6 rounded-md bg-x-front mb-2" />
      <View className="w-[70%] h-3 rounded-md bg-x-front mb-1" />
      <View className="w-[65%] h-3 rounded-md bg-x-front mb-6" />
      <View className="w-[50%] h-12 rounded-full border border-x-front" />
    </View>
  );
}
