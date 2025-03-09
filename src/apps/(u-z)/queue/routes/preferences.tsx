import { CustomSwitch } from "../components/custom-switch";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// queue-custom-switch-animation 🔽

export default function Preferences() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-[#141417]"
      contentContainerClassName="px-10"
      style={{ paddingTop: insets.top + 50 }}
    >
      <View className="h-7 w-[140px] rounded-full bg-neutral-800 mb-12" />
      <View className="gap-8 mb-12">
        {Array.from({ length: 4 }).map((_, index) => (
          <View className="flex-row items-center gap-4" key={index}>
            <View className="gap-1 flex-1">
              <View className="h-6 w-2/3 rounded-full bg-neutral-800" />
              <View className="h-4 w-1/2 rounded-full bg-neutral-800/50" />
            </View>
            <CustomSwitch />
          </View>
        ))}
        <View className="flex-row items-center gap-4">
          <View className="gap-1 flex-1">
            <View className="h-6 w-2/3 rounded-full bg-neutral-800" />
            <View className="h-4 w-1/2 rounded-full bg-neutral-800/50" />
          </View>
          <View className="h-12 w-[54px] rounded-full bg-neutral-800/50" />
        </View>
        <View className="flex-row items-center gap-4">
          <View className="gap-1 flex-1">
            <View className="h-6 w-2/3 rounded-full bg-neutral-800" />
            <View className="h-4 w-1/2 rounded-full bg-neutral-800/50" />
          </View>
          <View className="h-12 w-[54px] rounded-full bg-neutral-800/50" />
        </View>
      </View>
      <View className="h-px w-full bg-neutral-800 mb-16" />
      <View className="flex-row items-center gap-4">
        <View className="h-28 w-24 rounded-2xl bg-neutral-800/50" />
        <View className="gap-1 flex-1">
          <View className="h-6 w-2/3 rounded-full bg-neutral-800" />
          <View className="h-4 w-1/2 rounded-full bg-neutral-800/50 mb-3" />
          <View className="h-4 w-8 rounded-full bg-neutral-800/50" />
        </View>
      </View>
    </ScrollView>
  );
}

// queue-custom-switch-animation 🔼
