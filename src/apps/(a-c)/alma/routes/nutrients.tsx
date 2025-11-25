import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { FC } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { Carousel } from "../components/carousel/carousel";

export type NutrientsItem = {
  id: number;
  emoji: string;
  description: string;
};

const SLIDES: NutrientsItem[] = [
  { id: 1, emoji: "🦴", description: "Bone health" },
  { id: 2, emoji: "⚡️", description: "Support energy" },
  {
    id: 3,
    emoji: "⚖️",
    description: "Gain weight",
  },
  {
    id: 4,
    emoji: "🔬",
    description: "Track custom nutrients",
  },
  {
    id: 5,
    emoji: "⚖️",
    description: "Maintain weight",
  },
  {
    id: 6,
    emoji: "🫀",
    description: "Heart health",
  },
  {
    id: 7,
    emoji: "🤧",
    description: "Boost immunity",
  },
];

export const Nutrients: FC = () => {
  const insets = useSafeAreaInsets();
  const scrollOffsetX = useSharedValue(0);

  return (
    <View className="flex-1 bg-[#F7F5ED]" style={{ paddingTop: insets.top + 8 }}>
      <View className="items-center justify-center">
        <Pressable
          className="absolute left-6 z-50 w-12 h-12 rounded-[17px] bg-white items-center justify-center"
          onPress={simulatePress}
        >
          <ArrowLeft size={24} color="black" className="m-4" />
        </Pressable>
        <View className="w-12 h-12 rounded-[17px] bg-[#3C5627]" style={styles.borderCurve} />
      </View>

      <Text
        className="text-[24px] mt-10 px-10 text-center"
        style={{ fontFamily: "LibreBaskerville_400Regular", transform: [{ scaleY: 1.2 }] }}
      >
        Track nutrients towards the goals{" "}
        <Text className="text-[#3C5627] underline">you care about</Text>
      </Text>

      <View className="flex-1 mt-5 pt-20">
        <Carousel slides={SLIDES} scrollOffsetX={scrollOffsetX} />
      </View>

      <View className="bg-[#F7F5ED] px-8 mt-auto" style={{ paddingBottom: insets.bottom + 8 }}>
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
