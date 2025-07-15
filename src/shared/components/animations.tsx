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
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NewAnimations } from "./new-animations";
import { Pressable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useDrawer } from "../lib/providers/drawer-provider";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { colorKit } from "reanimated-color-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { QrCode } from "lucide-react-native";
import { useAppStore } from "../lib/store/app";

type AppSection = {
  title: string;
  imageSource: number;
  data: App["animations"];
};

type FlatDataItem =
  | { type: "header"; section: AppSection }
  | { type: "item"; animation: App["animations"][number] };

type Props = DrawerContentComponentProps;

const Animations: FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState("");

  const indexView = useAppStore.use.indexView();

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
    .filter((section: AppSection) =>
      section.title.toLowerCase().includes(query.trim().toLowerCase())
    );

  const _renderListHeader = () => {
    if (query.trim()) return <></>;
    return <NewAnimations navigation={navigation} />;
  };

  const _renderSectionHeader = useCallback(
    ({ section }: { section: AppSection }) => (
      <View className="bg-[#131316]">
        <View className="flex-row items-center gap-2 px-5 pt-4 pb-1">
          <Image source={section.imageSource} className="w-6 h-6" />
          <Text className="text-stone-50 text-base font-medium">{section.title}</Text>
          <View className="h-[2px] flex-1 rounded-full bg-[#212126]" />
        </View>
        <View className="absolute -bottom-3 left-0 right-0 h-4">
          <LinearGradient
            colors={["#131316", colorKit.setAlpha("#131316", 0.25).hex()]}
            style={StyleSheet.absoluteFill}
            locations={[0.25, 1]}
          />
        </View>
      </View>
    ),
    []
  );

  const _renderEmptyListComponent = useCallback(
    () => (
      <Animated.View entering={FadeInDown} className="flex-1 items-center justify-center">
        <Text className="text-stone-400 text-base">No animations found</Text>
      </Animated.View>
    ),
    []
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
    const indices: number[] = [];
    flatData.forEach((entry, index) => {
      if (entry.type === "header") {
        indices.push(index + headerComponentCount);
      }
    });
    return indices;
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
            if (Platform.OS === "android") {
              // There is weird bug on Android when you navigate from drawer to one animation
              // and after open drawer on go to other. It doesn't work so I added this setTimeout to fix it
              setTimeout(() => {
                router.push(item.animation.href);
              }, 0);
            } else {
              router.push(item.animation.href);
            }
            navigation.closeDrawer();
          }}
          style={styles.listItem}
        >
          <Text className="text-stone-400 text-base">{item.animation.name}</Text>
        </Pressable>
      );
    },
    [router, _renderSectionHeader, navigation]
  );

  return (
    <KeyboardAvoidingView className="flex-1" behavior="padding">
      <View className="flex-1 bg-[#131316]" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between gap-2 px-5 pb-5">
          <Pressable
            hitSlop={20}
            style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            onPress={() => router.replace("/")}
          >
            {indexView === "home" ? (
              <MaterialCommunityIcons name="home-circle" size={24} color="#fafaf9" />
            ) : (
              <QrCode size={20} color="#fafaf9" />
            )}
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
          className="bg-[#212126] rounded-xl p-3 text-stone-400 mx-4 mb-1"
          value={query}
          onChangeText={setQuery}
        />
        <View className="flex-1">
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
            contentContainerClassName="pt-3"
            contentContainerStyle={{ paddingBottom: insets.bottom + 70 }}
            stickyHeaderIndices={Platform.select({
              ios: stickyHeaderIndices,
              default: [],
            })}
            showsVerticalScrollIndicator={false}
          />
          <View className="absolute top-0 left-0 right-0 h-4">
            <LinearGradient
              colors={["#131316", colorKit.setAlpha("#131316", 0.1).hex()]}
              style={StyleSheet.absoluteFill}
              locations={[0.25, 1]}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});

export default memo(Animations);
