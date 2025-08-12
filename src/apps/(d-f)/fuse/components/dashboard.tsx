import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colorKit } from "reanimated-color-picker";
import { BalanceChangeToggle } from "./balance-view/balance-change-toggle";
import { Balance } from "./balance-view/balance";
import { BalanceAnimationProvider } from "../lib/providers/balance-animation-provider";
import { InfoCarousel } from "./info-carousel";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

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
          {/* fuse-balance-secure-view-toggle-animation 🔽 */}
          {/* Provider scope: wraps Balance + BalanceChangeToggle so they can share
              touch states and the tapped-view flag without prop drilling. */}
          <BalanceAnimationProvider>
            <Balance />
            {/* fuse-balance-change-toggle-animation 🔽 */}
            {/* Toggle reads the same shared values to micro-shift during long-press
                and to skip animations when percent view was explicitly tapped. */}
            <BalanceChangeToggle />
            {/* fuse-balance-change-toggle-animation 🔼 */}
          </BalanceAnimationProvider>
          {/* fuse-balance-secure-view-toggle-animation 🔼 */}
        </View>
        <View className="flex-row gap-2">
          <ActionButton label="Receive" onPress={simulatePress} />
          <ActionButton label="Swap" onPress={simulatePress} />
          <ActionButton label="Send" onPress={simulatePress} />
        </View>
      </View>
      <View className="h-[2px] bg-neutral-700" />
      <View className="flex-1 justify-end">
        <LinearGradient
          colors={[colorKit.setAlpha("#000", 0.1).hex(), colorKit.setAlpha("#000", 0).hex()]}
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row items-center justify-center gap-5 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} className="w-9 h-6 rounded-full bg-neutral-300" />
          ))}
        </View>
        {/* fuse-info-cards-carousel-animation 🔽 */}
        <InfoCarousel />
        {/* fuse-info-cards-carousel-animation 🔼 */}
      </View>
    </View>
  );
};
