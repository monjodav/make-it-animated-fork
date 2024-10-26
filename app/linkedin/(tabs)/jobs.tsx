import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const JobItem = () => {
  return (
    <View className="flex-row items-center px-4 gap-4">
      <View className="w-16 h-16 rounded-md bg-[#283036]" />
      <View className="flex-1 gap-2">
        <View className="w-[70%] h-3 rounded-md bg-[#283036]" />
        <View className="w-[50%] h-3 rounded-md bg-[#283036]" />
      </View>
    </View>
  );
};

const JobSection = () => {
  return (
    <View className="px-4 py-4 gap-4 bg-[#1C2226]">
      <JobItem />
      <View className="h-px bg-[#283036]" />
      <JobItem />
      <View className="h-px bg-[#283036]" />
      <JobItem />
    </View>
  );
};

export default function Jobs() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerClassName="gap-2">
        <View className="bg-[#1C2226]" style={{ height: insets.top + 16 }} />
        <JobSection />
        <JobSection />
        <JobSection />
        <JobSection />
      </ScrollView>
    </View>
  );
}
