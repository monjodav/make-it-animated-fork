import { View } from "react-native";
import { LinearIssues } from "../components/linear-issues";
import { TabBar } from "../components/tab-bar";

export default function DevIssues() {
  return (
    <View className="flex-1 bg-linear-back">
      <View className="flex-row items-center justify-between px-5 mb-4">
        <View className="h-4 w-8 rounded-lg bg-linear-front" />
        <View className="h-5 w-5 rounded-lg bg-linear-front" />
      </View>
      <View className="h-6 w-20 ml-5 mb-6 rounded-lg bg-linear-front" />
      <View className="mb-1">
        {/* linear-button-tabs-indicator-animation 🔽 */}
        <TabBar />
        {/* linear-button-tabs-indicator-animation 🔼 */}
      </View>
      <LinearIssues />
    </View>
  );
}
