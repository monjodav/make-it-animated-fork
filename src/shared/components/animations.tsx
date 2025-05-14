import { App, apps } from "../lib/constants/apps-list";
import { useRouter } from "expo-router";
import React, { FC, memo, useCallback, useMemo } from "react";
import { FlatList, Image, ListRenderItemInfo, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewAnimations } from "./new-animations";
import { Pressable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

type AppSection = {
  title: string;
  imageSource: number;
  data: App["animations"];
};

type Props = {
  query: string;
};

type FlatDataItem =
  | { type: "header"; section: AppSection }
  | { type: "item"; animation: App["animations"][number] };

const Animations: FC<Props> = ({ query }) => {
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

  const _renderListHeader = () => {
    if (query.trim()) return <></>;
    return <NewAnimations />;
  };

  const _renderSectionHeader = useCallback(
    ({ section }: { section: AppSection }) => (
      <View className="bg-[#131316]">
        {section.title !== sections[0].title && (
          <View className="h-[2px] rounded-full mx-2 bg-[#070708]" />
        )}
        <View className="flex-row items-center gap-2 px-5 py-4">
          <Image source={section.imageSource} className="w-6 h-6" />
          <Text className="text-stone-50 text-base font-medium">{section.title}</Text>
        </View>
      </View>
    ),
    [sections]
  );

  const _renderEmptyListComponent = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-stone-400 text-base">No animations found</Text>
    </View>
  );

  const flatData: FlatDataItem[] = useMemo(() => {
    const dataArr: FlatDataItem[] = [];
    sections.forEach((section) => {
      dataArr.push({ type: "header", section });
      section.data.forEach((animation) => {
        dataArr.push({ type: "item", animation });
      });
    });
    return dataArr;
  }, [sections]);

  const headerComponentCount = query.trim() ? 0 : 1;
  const stickyHeaderIndices = useMemo(() => {
    return flatData.reduce((acc: number[], entry, index) => {
      if (entry.type === "header") {
        acc.push(index + headerComponentCount);
      }
      return acc;
    }, []);
  }, [flatData, headerComponentCount]);

  const _renderFlatListItem = useCallback(
    ({ item }: ListRenderItemInfo<FlatDataItem>) => {
      if (item.type === "header") {
        return _renderSectionHeader({ section: item.section });
      }
      return (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(item.animation.href);
          }}
          style={styles.listItem}
        >
          <Text className="text-stone-400 text-base">{item.animation.name}</Text>
        </Pressable>
      );
    },
    [router, _renderSectionHeader]
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
      <FlatList
        data={flatData}
        keyExtractor={(entry, index) =>
          entry.type === "header"
            ? `header-${entry.section.title}-${index}`
            : `item-${entry.animation.name}-${index}`
        }
        renderItem={_renderFlatListItem}
        ListHeaderComponent={_renderListHeader}
        ListEmptyComponent={_renderEmptyListComponent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 50 }}
        stickyHeaderIndices={stickyHeaderIndices}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export default memo(Animations);
