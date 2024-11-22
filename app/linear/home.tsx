import { LinearIssues } from "@/components/linear/linear-issues";
import { TabBar } from "@/components/linear/tab-bar";
import { ArrowLeft, MoreHorizontal, SquareArrowOutUpRight } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-linear-back"
      style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }}
    >
      <View className="flex-row items-center justify-between px-5 mb-4">
        <View className="h-4 w-8 rounded-lg bg-linear-front" />
        <View className="h-5 w-5 rounded-lg bg-linear-front" />
      </View>
      <View className="h-6 w-20 ml-5 mb-6 rounded-lg bg-linear-front" />
      <View className="mb-1">
        <TabBar />
      </View>
      <LinearIssues />
      <View className="flex-row items-center justify-between px-8 pt-4">
        <ArrowLeft size={18} color="#3a3446" />
        <SquareArrowOutUpRight size={20} color="#3a3446" />
        <MoreHorizontal size={20} color="#3a3446" />
      </View>
    </View>
  );
}
