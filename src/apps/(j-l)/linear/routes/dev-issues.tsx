import { View } from "react-native";
import { LinearIssues } from "../components/linear-issues";
import { TabBar } from "../components/tab-bar";

export default function DevIssues() {
  return (
    <View className="flex-1 bg-linear-back pt-2">
      <View className="h-6 w-20 ml-5 mb-6 rounded-full bg-linear-front" />
      <View className="mb-1">
        {/* linear-button-tabs-indicator-animation 🔽 */}
        <TabBar />
        {/* linear-button-tabs-indicator-animation 🔼 */}
      </View>
      <LinearIssues />
    </View>
  );
}
