import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { FC } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { Carousel } from "../components/carousel";

export type NutrientsItem = {
  id: number;
  emoji: string;
  description: string;
  backgroundElement: React.ReactNode;
};

const SLIDES: NutrientsItem[] = [
  {
    id: 0,
    emoji: "🦴",
    description: "Bone health",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-orange-200/25 rounded-xl rotate-[-45deg]" />
        <View className="absolute w-[50%] aspect-square rounded-full bg-orange-700/25 -top-[25%] -left-[5%]" />
        <View className="absolute w-[50%] h-[100%] rounded-full bg-green-600/25 -bottom-[25%] -right-[4%] rotate-[25deg]" />
      </>
    ),
  },
  {
    id: 1,
    emoji: "🦴",
    description: "Bone health",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-orange-200/25 rounded-xl rotate-[-45deg]" />
        <View className="absolute w-[50%] aspect-square rounded-full bg-orange-700/25 -top-[25%] -left-[5%]" />
        <View className="absolute w-[50%] h-[100%] rounded-full bg-green-600/25 -bottom-[25%] -right-[4%] rotate-[25deg]" />
      </>
    ),
  },
  {
    id: 2,
    emoji: "⚡️",
    description: "Support energy",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-orange-200/25 rounded-xl rotate-[-45deg]" />
        <View className="absolute w-[50%] aspect-square rounded-full bg-orange-700/25 -top-[25%] -left-[5%]" />
        <View className="absolute w-[50%] h-[100%] rounded-full bg-green-600/25 -bottom-[25%] -right-[4%] rotate-[25deg]" />
      </>
    ),
  },
  {
    id: 3,
    emoji: "⚖️",
    description: "Gain weight",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-red-200/50 rounded-xl rotate-[45deg]" />
        <View className="absolute w-[50%] aspect-video rounded-full bg-orange-700/25 -bottom-[15%] -left-[5%]" />
        <View className="absolute w-[50%] h-[100%] rounded-full bg-green-600/50 -top-[35%] right-[0%] rotate-[25deg]" />
      </>
    ),
  },
  {
    id: 4,
    emoji: "🔬",
    description: "Track custom nutrients",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-orange-200/25 rounded-xl rotate-[45deg]" />
        <View className="absolute h-[100%] aspect-square rounded-full bg-yellow-300/50 -bottom-[12%] -left-[17%] items-center justify-center">
          <View className="w-[90%] h-[90%] rounded-full bg-orange-500/50" />
        </View>
        <View className="absolute h-[100%] aspect-square rounded-full bg-green-600/50 -top-[25%] -right-[10%]" />
      </>
    ),
  },
  {
    id: 5,
    emoji: "⚖️",
    description: "Maintain weight",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-orange-200/25 rounded-xl rotate-[-45deg]" />
        <View className="absolute w-[50%] aspect-square rounded-full bg-orange-700/25 -top-[25%] -left-[5%]" />
        <View className="absolute w-[50%] h-[100%] rounded-full bg-green-600/25 -bottom-[25%] -right-[4%] rotate-[25deg]" />
      </>
    ),
  },
  {
    id: 6,
    emoji: "🫀",
    description: "Heart health",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-red-200/50 rounded-xl rotate-[45deg]" />
        <View className="absolute w-[50%] aspect-video rounded-full bg-orange-700/25 -bottom-[15%] -left-[5%]" />
        <View className="absolute w-[50%] h-[100%] rounded-full bg-green-600/50 -top-[35%] right-[0%] rotate-[25deg]" />
      </>
    ),
  },
  {
    id: 7,
    emoji: "🤧",
    description: "Boost immunity",
    backgroundElement: (
      <>
        <View className="absolute w-[100%] h-[100%] bg-orange-200/25 rounded-xl rotate-[45deg]" />
        <View className="absolute h-[100%] aspect-square rounded-full bg-yellow-300/50 -bottom-[12%] -left-[17%] items-center justify-center">
          <View className="w-[90%] h-[90%] rounded-full bg-orange-500/50" />
        </View>
        <View className="absolute h-[100%] aspect-square rounded-full bg-green-600/50 -top-[25%] -right-[10%]" />
      </>
    ),
  },
];

export const Nutrients: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-[#F7F5ED]"
      style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }}
    >
      <View className="absolute inset-0 justify-center items-center">
        <Carousel slides={SLIDES} />
      </View>

      <View className="items-center justify-center mb-10">
        <Pressable
          className="absolute left-6 z-50 size-12 rounded-2xl items-center justify-center border border-stone-200"
          style={styles.borderCurve}
          onPress={simulatePress}
        >
          <ArrowLeft size={24} color="black" className="m-4" />
        </Pressable>
        <View className="size-12 rounded-2xl bg-[#3C5627]" style={styles.borderCurve} />
      </View>

      <Text
        className="text-[24px] px-10 text-center"
        style={{ fontFamily: "LibreBaskerville_400Regular", transform: [{ scaleY: 1.2 }] }}
      >
        Track nutrients towards the goals{" "}
        <Text className="text-[#3C5627] underline">you care about</Text>
      </Text>

      <View className="px-8 mt-auto">
        <Pressable
          className="bg-[#3C5627] h-[56px] px-3 rounded-[19px] items-center justify-center"
          style={styles.borderCurve}
          onPress={simulatePress}
        >
          <Text className="text-lg text-white font-medium">Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
