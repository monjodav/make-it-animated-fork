import { App, apps } from "../lib/constants/apps-list";
import { useRouter } from "expo-router";
import React, { FC, memo, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewAnimations } from "./new-animations";
import { Pressable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { Home } from "lucide-react-native";
import { useDrawer } from "../lib/providers/drawer-provider";

type AppSection = {
  title: string;
  imageSource: number;
  data: App["animations"];
};

type FlatDataItem =
  | { type: "header"; section: AppSection }
  | { type: "item"; animation: App["animations"][number] };

const Animations: FC = () => {
  const [query, setQuery] = useState("");

  const { drawerTextInputRef } = useDrawer();

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
        <View className="flex-row items-center gap-2 px-5 py-4">
          <Image source={section.imageSource} className="w-6 h-6" />
          <Text className="text-stone-50 text-base font-medium">{section.title}</Text>
          <View className="h-[2px] flex-1 rounded-full bg-[#212126]" />
        </View>
      </View>
    ),
    []
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
    <View className="flex-1 bg-[#131316]" style={{ paddingTop: insets.top + 16 }}>
      <View className="flex-row items-center justify-between gap-2 px-5 pb-5">
        <Pressable
          hitSlop={20}
          style={{ flexDirection: "row", gap: 4, alignItems: "flex-end" }}
          onPress={() => router.replace("/")}
        >
          <Home size={16} color="#fafaf9" strokeWidth={1.5} />
          <Text className="text-stone-50 text-sm/4">Home</Text>
        </Pressable>
        <View className="flex-row items-center gap-2">
          <Text className="text-stone-400 text-sm">
            <Text className="text-stone-50">
              {sections.reduce((acc, section) => acc + section.data.length, 0)}
            </Text>{" "}
            animations
          </Text>
          <Text className="text-stone-400 text-sm">
            <Text className="text-stone-50">{sections.length}</Text>{" "}
            {sections.length === 1 ? "app" : "apps"}
          </Text>
        </View>
      </View>
      <TextInput
        ref={drawerTextInputRef}
        placeholder="Search app..."
        placeholderTextColor="#a8a29e"
        className="bg-[#212126] rounded-xl p-3 text-stone-400 mb-4 mx-4"
        value={query}
        onChangeText={setQuery}
      />
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
