import { StyleSheet, Text, View, Platform, TouchableOpacity } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { Check } from "lucide-react-native";
import { cn } from "@/src/shared/lib/utils/cn";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type PlanCardProps = {
  title: string;
  price: string;
  subtitle: string;
  isSelected: boolean;
  onPress: () => void;
};

const PlanCard = ({ title, price, subtitle, isSelected, onPress }: PlanCardProps) => {
  return (
    <View
      className={cn(
        "flex-1 rounded-[18px] border-[2px]",
        isSelected ? "border-white" : "border-transparent"
      )}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className={cn(
          "p-3 rounded-[18px] overflow-hidden border-[0.5px] border-neutral-700/40",
          Platform.OS === "android" ? "bg-neutral-700" : "bg-neutral-700/30"
        )}
        style={styles.borderCurve}
        onPress={onPress}
      >
        <BlurView tint="dark" style={StyleSheet.absoluteFill} />
        {isSelected && (
          <View className="absolute rounded-full right-3 top-3 p-1 bg-white">
            <Check size={10} color="#404040" strokeWidth={5} />
          </View>
        )}
        <Text className="text-neutral-50 text-xl font-bold">{title}</Text>
        <Animated.Text
          key={title + price}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="text-neutral-50 text-xl font-bold mb-1"
        >
          {price}
        </Animated.Text>
        <Text className="text-neutral-400">{subtitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

type PlanControlProps = {
  selectedCard: "1" | "2";
  setSelectedCard: (value: "1" | "2") => void;
  price: { monthly: number[]; yearly: number[] };
  period: "monthly" | "yearly";
};

const PlanControl = ({ selectedCard, setSelectedCard, price, period }: PlanControlProps) => {
  const currentPrices = price[period] ?? [];
  const proPrice = currentPrices[0] ?? 0;
  const advPrice = currentPrices[1] ?? 0;

  return (
    <View className="self-stretch flex-row mb-4 items-center justify-between gap-2">
      <PlanCard
        title="Pro"
        price={`${proPrice} USD`}
        subtitle="First 2 weeks free"
        isSelected={selectedCard === "1"}
        onPress={() => setSelectedCard("1")}
      />
      <PlanCard
        title="Advanced AI"
        price={`${advPrice} USD`}
        subtitle="First 2 weeks free"
        isSelected={selectedCard === "2"}
        onPress={() => setSelectedCard("2")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

export default PlanControl;
