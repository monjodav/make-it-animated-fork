import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
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
        className="px-3 py-5 rounded-3xl bg-[#515151] flex-row items-center gap-4 overflow-hidden"
        style={[
          styles.borderCurve,
          {
            backgroundColor: Platform.OS === "ios" ? "#515151" : "#1C1C1C",
            borderWidth: Platform.OS === "ios" ? 0 : 1,
            borderColor: Platform.OS === "ios" ? "transparent" : "#303030",
          },
        ]}
      >
        {Platform.OS === "ios" ? (
          <>
            <View className="absolute h-36 left-1 right-1 top-1.5 bg-[#1C1C1C] rounded-3xl rounded-br-2xl rounded-bl-2xl shadow-[-4_-3_3_#1C1C1C]" />
            <View className="absolute h-36 left-1 right-1 top-1.5 bg-[#1C1C1C] rounded-3xl rounded-br-2xl rounded-bl-2xl shadow-[4_-3_3_#1C1C1C]" />
          </>
        ) : null}

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
