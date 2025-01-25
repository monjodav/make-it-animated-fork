import { App, apps } from "@/constants/_home/the-list";
import { useRouter } from "expo-router";
import React, { FC, useState } from "react";
import {
  Image,
  ListRenderItemInfo,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppSection = {
  title: string;
  imageSource: number;
  data: App["animations"];
};

export const Animations: FC = () => {
  const [query, setQuery] = useState("");

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const sections: AppSection[] = apps
    .map(
      (app: App): AppSection => ({
        title: app.name,
        imageSource: app.imageSource,
        data: app.animations,
      })
    )
    .filter((section: AppSection) => section.title.toLowerCase().includes(query.toLowerCase()));

  const _renderSectionHeader = ({ section }: { section: AppSection }) => (
    <View className="bg-[#131316]">
      <View className="h-2 bg-[#070708]" />
      <View className="flex-row items-center gap-2 px-5 py-4">
        <Image source={section.imageSource} className="w-6 h-6" />
        <Text className="text-[#9394a1]">{section.title}</Text>
      </View>
    </View>
  );

  const _renderItem = ({ item, index }: ListRenderItemInfo<App["animations"][number]>) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => router.push(item.href)}
      className="px-5 py-4"
    >
      <Text className="text-[#cccfd5]">
        {index + 1}. {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#131316]" style={{ paddingTop: insets.top + 12 }}>
      <View className="flex-row items-center gap-2 mb-8 px-5">
        <TextInput
          placeholder="Search app..."
          placeholderTextColor="#9394a1"
          className="flex-1 bg-[#212126] rounded-lg p-3 text-[#cccfd5]"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {__DEV__ && (
        <View className="px-5 pb-5">
          <Text className="text-neutral-500">
            {sections.reduce((acc, section) => acc + section.data.length, 0)} animations
          </Text>
        </View>
      )}
      <SectionList
        sections={sections}
        keyExtractor={(item: App["animations"][number], index: number) => `${item.name}-${index}`}
        renderSectionHeader={_renderSectionHeader}
        renderItem={_renderItem}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
      />
    </View>
  );
};
