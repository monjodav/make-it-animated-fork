import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Grok() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 px-6 bg-black" style={{ paddingTop: insets.top + 16 }}>
      <View className="w-[50%] h-6 rounded-md bg-neutral-900 mb-2" />
      <View className="w-[70%] h-3 rounded-md bg-neutral-900 mb-8" />
      <View className="w-[35%] h-4 rounded-md bg-neutral-900 mb-2" />
      <View className="w-[80%] h-3 rounded-md bg-neutral-900 mb-1" />
      <View className="w-[45%] h-3 rounded-md bg-neutral-900 mb-6" />
      <View className="w-full aspect-video rounded-xl bg-neutral-900" />
    </View>
  );
}
