import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { Check } from "lucide-react-native";
import { cn } from "@/src/shared/lib/utils/cn";

type TabsSwitcherProps = {
  selectedCard: "1" | "2";
  setSelectedCard: (value: "1" | "2") => void;
  price: { monthly: number[]; yearly: number[] };
  period: "monthly" | "yearly";
};

const TabsSwitcher = ({ selectedCard, setSelectedCard, price, period }: TabsSwitcherProps) => {
  const currentPrices = price[period] ?? [];
  const proPrice = currentPrices[0] ?? 0;
  const advPrice = currentPrices[1] ?? 0;

  const formatUSD = (n: number) =>
    `${n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;

  return (
    <View className="self-stretch flex-row mb-4 items-center justify-between gap-2">
      <Pressable
        onPress={() => setSelectedCard("1")}
        className={cn(
          "flex-1 p-3 rounded-2xl overflow-hidden bg-neutral-700/50 border-[2px]",
          selectedCard === "1" ? "border-white" : "border-transparent"
        )}
      >
        <BlurView tint="dark" style={StyleSheet.absoluteFill} />
        {selectedCard === "1" && (
          <View className="absolute rounded-full right-3 top-3 p-1 bg-white">
            <Check size={10} color={"#92888A"} strokeWidth={5} />
          </View>
        )}
        <Text className="text-[#E0E0E1] text-xl font-bold">Pro</Text>
        <Text className="text-[#E0E0E1] text-xl font-bold">{formatUSD(proPrice)}</Text>
        <Text className="text-[#92888A]">First 2 weeks free</Text>
      </Pressable>
      <Pressable
        onPress={() => setSelectedCard("2")}
        className={cn(
          "flex-1 p-3 rounded-2xl overflow-hidden bg-neutral-700/50 border-[2px]",
          selectedCard === "2" ? "border-white" : "border-transparent"
        )}
      >
        <BlurView tint="dark" style={StyleSheet.absoluteFill} />
        {selectedCard === "2" && (
          <View className="absolute rounded-full right-3 top-3 p-1 bg-white">
            <Check size={10} color={"#92888A"} strokeWidth={5} />
          </View>
        )}
        <Text className="text-[#E0E0E1] text-xl font-bold">Advanced AI</Text>
        <Text className="text-[#E0E0E1] text-xl font-bold">{formatUSD(advPrice)}</Text>
        <Text className="text-[#92888A]">First 2 weeks free</Text>
      </Pressable>
    </View>
  );
};

export default TabsSwitcher;
