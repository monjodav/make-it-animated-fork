import { ListItem } from "./list-item";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SectionList, View } from "react-native";

type Section = {
  title: string;
  data: number[];
};

const createMockData = (length: number): number[] => Array.from({ length });

const _sections: Section[] = [
  { title: "In Review", data: createMockData(2) },
  { title: "In Progress", data: createMockData(8) },
  { title: "Todo", data: createMockData(13) },
  { title: "Backlog", data: createMockData(21) },
];

const _renderItem = () => <ListItem />;

const _renderSectionHeader = ({ section: { title } }: { section: Section }) => (
  <View className="flex-row items-center justify-between">
    <View className="h-4 w-24 mt-6 mb-3 rounded-full bg-linear-front" />
    <AntDesign name="plus" size={24} color="#3a3446" />
  </View>
);

export const LinearIssues = () => (
  <SectionList
    sections={_sections}
    keyExtractor={(_, index) => index.toString()}
    renderItem={_renderItem}
    renderSectionHeader={_renderSectionHeader}
    contentContainerClassName="gap-3 px-5"
    stickySectionHeadersEnabled={false}
    showsVerticalScrollIndicator={false}
  />
);
