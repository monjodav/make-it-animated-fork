import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import * as Updates from "expo-updates";
import { updateAlert } from "@/src/shared/lib/hooks/use-update";
import { useAppStore } from "@/src/shared/lib/store/app";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const OtaUpdate = () => {
  const insets = useSafeAreaInsets();

  const isOtaUpdateAvailable = useAppStore.use.isOtaUpdateAvailable();

  if (!isOtaUpdateAvailable) return <></>;

  return (
    <View className="absolute left-4 right-4 gap-4" style={{ top: insets.top + 16 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => Updates.reloadAsync()}
        className="px-3 py-5 rounded-3xl bg-[#212126] flex-row items-center gap-4"
        style={styles.borderCurve}
      >
        <Bell color="gray" fill="gray" strokeWidth={1.5} />
        <View className="gap-1 flex-1">
          <Text className="text-white text-base">{updateAlert.title}</Text>
          <Text className="text-white text-sm font-light">
            {updateAlert.message} <Text className="underline text-orange-200">Refresh now.</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
