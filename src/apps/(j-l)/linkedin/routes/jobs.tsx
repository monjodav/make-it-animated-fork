import { JobSection } from "../components/job-section";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Jobs() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <ScrollView contentContainerClassName="gap-2">
        <View className="bg-linkedin-back" style={{ height: insets.top + 16 }} />
        <JobSection />
        <JobSection />
        <JobSection />
        <JobSection />
      </ScrollView>
    </View>
  );
}
