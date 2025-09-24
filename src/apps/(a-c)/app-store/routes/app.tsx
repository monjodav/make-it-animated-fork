import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: "white", marginTop: insets.top }}
    >
      <View className="h-[600px] bg-stone-100 justify-end px-6 pb-3">
        <View className="h-6 w-[100px] bg-white mb-1" />
        <View className="h-6 w-[130px] bg-white mb-4" />
        <View className="h-12 w-full bg-white" />
      </View>
      <View className="h-[600px] bg-stone-100 justify-end px-6 pb-3">
        <View className="h-6 w-[100px] bg-white mb-1" />
        <View className="h-6 w-[130px] bg-white mb-4" />
        <View className="h-12 w-full bg-white" />
      </View>
      <View className="h-[600px] bg-stone-100 justify-end px-6 pb-3">
        <View className="h-6 w-[100px] bg-white mb-1" />
        <View className="h-6 w-[130px] bg-white mb-4" />
        <View className="h-12 w-full bg-white" />
      </View>
    </ScrollView>
  );
}
