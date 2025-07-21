import React, { FC } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AudioLines, File, Fullscreen, ImagePlus, Settings2 } from "lucide-react-native";
import { MenuTrigger } from "../components/attach-file-menu/menu-trigger";

const classNames = {
  quickActionContainer:
    "gap-3 px-5 justify-center rounded-[28px] border-[1.5px] border-white/5 bg-sky-50/[0.07]",
  quickActionText: "text-white text-lg font-medium",
};

export const Chat: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-black"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 8 }}
    >
      <ScrollView />
      <View className="h-[84px] mb-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 gap-2"
        >
          <Pressable
            className={classNames.quickActionContainer}
            style={styles.borderCurve}
            onPress={() => Alert.alert("Voice Mode")}
          >
            <AudioLines size={20} color="gray" />
            <Text className={classNames.quickActionText}>Voice Mode</Text>
          </Pressable>
          <Pressable
            className={classNames.quickActionContainer}
            style={styles.borderCurve}
            onPress={() => Alert.alert("Create Images")}
          >
            <ImagePlus size={20} color="gray" />
            <Text className={classNames.quickActionText}>Create Images</Text>
          </Pressable>
          <Pressable
            className={classNames.quickActionContainer}
            style={styles.borderCurve}
            onPress={() => Alert.alert("Edit Image")}
          >
            <ImagePlus size={20} color="gray" />
            <Text className={classNames.quickActionText}>Create Images</Text>
          </Pressable>
          <Pressable
            className={classNames.quickActionContainer}
            style={styles.borderCurve}
            onPress={() => Alert.alert("Edit Image")}
          >
            <Fullscreen size={20} color="gray" />
            <Text className={classNames.quickActionText}>Edit Image</Text>
          </Pressable>
          <Pressable
            className={classNames.quickActionContainer}
            style={styles.borderCurve}
            onPress={() => Alert.alert("Analyze Docs")}
          >
            <File size={20} color="gray" />
            <Text className={classNames.quickActionText}>Analyze Docs</Text>
          </Pressable>
          <Pressable
            className={classNames.quickActionContainer}
            style={styles.borderCurve}
            onPress={() => Alert.alert("Customize Grok")}
          >
            <Settings2 size={20} color="gray" />
            <Text className={classNames.quickActionText}>Customize Grok</Text>
          </Pressable>
        </ScrollView>
      </View>
      <View className="px-5">
        <View className="p-3 rounded-[28px] border-[1.5px] border-white/5 bg-sky-50/[0.07]">
          <Text className="text-neutral-500 text-xl font-medium mb-5 mt-1 ml-1">Ask Anything</Text>
          <View className="flex-row justify-between h-9">
            <View className="flex-row items-center gap-2">
              {/* grok-attach-file-menu-animation 🔽 */}
              <MenuTrigger />
              {/* grok-attach-file-menu-animation 🔼 */}
              <View className="w-[100px] h-full border border-white/5 rounded-full" />
              <View className="aspect-square h-full border border-white/5 rounded-full" />
              <View className="aspect-square h-full border border-white/5 rounded-full" />
            </View>
            <View className="w-[80px] h-full border border-white/5 rounded-full" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
