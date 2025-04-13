import { App, apps } from "../lib/constants/apps-list";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { Image, ListRenderItemInfo, SectionList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewAnimations } from "./new-animations";

type AppSection = {
  title: string;
  imageSource: number;
  data: App["animations"];
};

type Props = {
  query: string;
};

export const Animations: FC<Props> = ({ query }) => {
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const sections: AppSection[] = apps
    .map(
      (app: App): AppSection => ({
        title: app.name,
        imageSource: app.imageSource,
        data: app.animations,
      })
    )
    .filter((section: AppSection) => section.title.toLowerCase().includes(query.toLowerCase()));

  const _renderListHeader = () => <NewAnimations />;

  const _renderSectionHeader = ({ section }: { section: AppSection }) => (
    <View className="bg-[#131316]">
      <View className="h-[2px] rounded-full mx-2 bg-[#070708]" />
      <View className="flex-row items-center gap-2 px-5 py-4">
        <Image source={section.imageSource} className="w-6 h-6" />
        <Text className="text-stone-50 text-base font-medium">{section.title}</Text>
      </View>
    </View>
  );

  const _renderItem = ({ item, index }: ListRenderItemInfo<App["animations"][number]>) => (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => router.push(item.href)}
      className="px-5 py-4"
    >
      <Text className="text-stone-400 text-base">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#131316]">
      {__DEV__ ? (
        <View className="flex-row items-center gap-2 px-5 py-5">
          <Text className="text-orange-200/50 text-sm">
            {sections.reduce((acc, section) => acc + section.data.length, 0)} animations
          </Text>
          <Text className="text-neutral-500 text-sm">|</Text>
          <Text className="text-orange-200/50 text-sm">
            {sections.length} {sections.length === 1 ? "app" : "apps"}
          </Text>
        </View>
      ) : (
        <></>
      )}
      <SectionList
        sections={sections}
        keyExtractor={(item: App["animations"][number], index: number) => `${item.name}-${index}`}
        renderSectionHeader={_renderSectionHeader}
        renderItem={_renderItem}
        ListHeaderComponent={_renderListHeader}
        contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};
