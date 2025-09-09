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
        className="px-3 py-5 rounded-3xl bg-neutral-800/50 border border-neutral-700/50 flex-row items-center gap-4"
        style={styles.borderCurve}
      >
        <Bell color="#a3a3a3" fill="#a3a3a3" strokeWidth={1.5} />
        <View className="gap-1 flex-1">
          <Text className="text-neutral-50 text-base font-poppins-medium">{updateAlert.title}</Text>
          <Text className="text-neutral-400 text-sm font-poppins-normal">
            {updateAlert.message}{" "}
            <Text className="underline text-sm text-brand font-poppins-medium">Refresh now.</Text>
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
