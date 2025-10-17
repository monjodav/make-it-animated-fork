import { View } from "react-native";

export const createMockData = (length: number): number[] => Array.from({ length });

export const sections = [
  {
    key: "s1",
    data: createMockData(4),
  },
  {
    key: "s2",
    data: createMockData(2),
  },
  {
    key: "s3",
    data: createMockData(10),
  },
];

export const renderSectionHeader = () => (
  <View className="h-4 w-[150] mx-5 rounded-full bg-linear-front" />
);

export const renderListItem = () => (
  <View className="flex-row px-5 py-2 items-center gap-4">
    <View className="size-6 rounded-full bg-linear-front" />
    <View
      className="h-3 rounded-full bg-linear-front"
      style={{ width: `${Math.random() * 35 + 60}%` }}
    />
  </View>
);
