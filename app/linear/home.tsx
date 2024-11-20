import { LinearIssues } from "@/components/linear/linear-issues";
import { TabBar } from "@/components/linear/tab-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabData = [
  { id: "0", title: "All Issues" },
  { id: "1", title: "Active" },
  { id: "2", title: "Backlog" },
  { id: "3", title: "Current" },
  { id: "4", title: "Done" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("");

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-linear-back" style={{ paddingTop: insets.top }}>
      <TabBar />
      <LinearIssues />
    </View>
  );
}
