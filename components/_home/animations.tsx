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

type AppSection = {
  title: string;
  imageSource: number;
  data: App["animations"];å
};

export const Animations: FC = () => {
  const [query, setQuery] = useState("");

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
      <View className="h-1 rounded-full bg-[#070708]" />
      <View className="flex-row items-center gap-2 px-5 py-4">
        <Image source={section.imageSource} className="w-6 h-6" />
        <Text className="text-stone-50 text-base">{section.title}</Text>
      </View>
    </View>
  );

  const _renderItem = ({ item, index }: ListRenderItemInfo<App["animations"][number]>) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => router.push(item.href)}
      className="px-5 py-4"
    >
      <Text className="text-stone-400 text-sm">
        <Text className="text-xs">{index + 1}.</Text> {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#131316]">
      <View className="flex-row items-center gap-2 mb-8">
        <TextInput
          placeholder="Search app..."
          placeholderTextColor="#9394a1"
          className="flex-1 bg-[#212126] rounded-xl p-3 text-[#cccfd5]"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {__DEV__ && (
        <View className="flex-row items-center gap-2 px-5 pb-5">
          <Text className="text-amber-200 text-sm">
            {sections.reduce((acc, section) => acc + section.data.length, 0)} animations
          </Text>
          <Text className="text-neutral-500 text-sm">|</Text>å
          <Text className="text-amber-200 text-sm">
            {sections.length} {sections.length === 1 ? "app" : "apps"}
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
        scrollEnabled={false}
      />
    </View>
  );
};
