import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colorKit } from "reanimated-color-picker";
import { BalanceChangeToggle } from "./balance-change-toggle";

type ActionButtonProps = {
  label: string;
  onPress: () => void;
};

const ActionButton: FC<ActionButtonProps> = ({ label, onPress }) => {
  return (
    <Pressable
      className="flex-row items-center gap-2 bg-neutral-900 rounded-full py-1.5 pl-2 pr-3"
      onPress={onPress}
    >
      <View className="w-4 h-4 rounded-full bg-neutral-300" />
      <Text className="text-neutral-200 text-sm font-semibold">{label}</Text>
    </Pressable>
  );
};

export const Dashboard: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom + 30 }}>
      <View className="flex-1 p-5">
        <Text className="text-neutral-400 font-medium mb-4">Balance</Text>
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row">
            <Text className="text-neutral-900 text-3xl font-bold">$</Text>
            <Text className="text-neutral-900 text-6xl font-bold">0</Text>
            <Text className="text-neutral-400 text-6xl font-bold">.00</Text>
          </View>
          {/* fuse-balance-change-toggle-animation 🔽 */}
          <BalanceChangeToggle />
          {/* fuse-balance-change-toggle-animation 🔼 */}
        </View>
        <View className="flex-row gap-2">
          <ActionButton label="Receive" onPress={() => Alert.alert("Receive")} />
          <ActionButton label="Swap" onPress={() => Alert.alert("Swap")} />
          <ActionButton label="Send" onPress={() => Alert.alert("Send")} />
        </View>
      </View>
      <View className="h-[2px] bg-neutral-700" />
      <View className="flex-1 justify-end p-5">
        <LinearGradient
          colors={[colorKit.setAlpha("#000", 0.1).hex(), colorKit.setAlpha("#000", 0).hex()]}
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row items-center justify-center gap-5 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} className="w-9 h-6 rounded-full bg-neutral-300" />
          ))}
        </View>
        <View className="w-full h-20 bg-neutral-300 rounded-2xl" />
      </View>
    </View>
  );
};
