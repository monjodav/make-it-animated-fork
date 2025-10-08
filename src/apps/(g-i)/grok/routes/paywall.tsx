import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChartNoAxesColumn,
  Check,
  Heart,
  ImagePlus,
  Lightbulb,
  Orbit,
  Rocket,
  Sparkle,
  ThumbsUp,
  X,
} from "lucide-react-native";
import { useState } from "react";
import { cn } from "@/src/shared/lib/utils/cn";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import Switcher from "../components/switcher/switcher";

const FEATURES_BLOCK_ONE = [
  { id: "f1", icon: "Sparkle", title: "Higher usage on Fast & Expert" },
  { id: "f2", icon: "ImagePlus", title: "Higher usage on Grock Imagine" },
  { id: "f3", icon: "ChartNoAxesColumn", title: "Higher usage on Voice Mode and Companions" },
  { id: "f4", icon: "ThumbsUp", title: "Early access to new features" },
] as const;

const FEATURES_BLOCK_TWO = [
  { id: "g1", icon: "Orbit", title: "Everything in SuperGrok" },
  { id: "g2", icon: "Rocket", title: "Access to Heavy" },
  { id: "g3", icon: "Lightbulb", title: "Highest usage on Fast & Expert" },
  { id: "g4", icon: "ImagePlus", title: "Highest usage on Grok Imagine" },
  { id: "g5", icon: "Sparkle", title: "Early access to new features" },
  { id: "g6", icon: "Heart", title: "Dedicated support" },
] as const;

const ICON_COLOR = "#E0E0E1";

const _featureItem = (item: { icon: string; title: string }) => {
  return (
    <>
      <View className="flex-row flex-1 items-center">
        {item.icon === "Sparkle" && <Sparkle size={20} color={ICON_COLOR} strokeWidth={3} />}
        {item.icon === "ImagePlus" && <ImagePlus size={20} color={ICON_COLOR} strokeWidth={3} />}
        {item.icon === "ChartNoAxesColumn" && (
          <ChartNoAxesColumn size={20} color={ICON_COLOR} strokeWidth={3} />
        )}
        {item.icon === "Heart" && <Heart size={20} color={ICON_COLOR} strokeWidth={3} />}
        {item.icon === "Rocket" && <Rocket size={20} color={ICON_COLOR} strokeWidth={3} />}
        {item.icon === "Orbit" && <Orbit size={20} color={ICON_COLOR} strokeWidth={3} />}
        {item.icon === "Lightbulb" && <Lightbulb size={20} color={ICON_COLOR} strokeWidth={3} />}
        {item.icon === "ThumbsUp" && <ThumbsUp size={20} color={ICON_COLOR} strokeWidth={3} />}
        <Text className="text-[#E0E0E1] text-lg font-bold ml-3">{item.title}</Text>
      </View>
      <Check size={18} color={ICON_COLOR} strokeWidth={3} />
    </>
  );
};

export const Paywall = () => {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState("1");

  const currentFeatures = value === "1" ? FEATURES_BLOCK_ONE : FEATURES_BLOCK_TWO;

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 items-center bg-black">
      <Pressable
        onPress={simulatePress}
        style={{ marginTop: insets.top + 5 }}
        className="absolute rounded-full left-5 z-10 p-2 bg-[#1A1A1A]"
      >
        <X size={14} color="#616161" strokeWidth={4} />
      </Pressable>

      <View className="flex-1 w-full relative">
        <Image
          style={{ width: "100%", aspectRatio: 1.3 }}
          placeholder={{
            blurhash:
              "i02rmu?b004.-A-UtmNHD$-=fRI9ogx]WURkf5j[009E~q^+OsELMc$*-=8^oL?wRiD$s:tQkXof~q?c9[4.MI-V.9I:IA",
          }}
        />
        <Animated.ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerClassName="px-5 pt-[160]"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-[#E0E0E1] text-5xl font-semibold self-center">SuperGrok</Text>
          <Text className="text-[#E0E0E1] text-2xl font-semibold self-center text-center mt-1">
            Introducing Grok 4 Fast: the most intelligent fast model
          </Text>
          <Animated.View layout={LinearTransition}>
            {currentFeatures.map((item, idx) => (
              <Animated.View
                key={`${value}-${item.id}`}
                className={cn(
                  "flex-row width-full py-3 items-center justify-between",
                  idx === 0 && "mt-7"
                )}
                entering={FadeIn}
                exiting={FadeOut}
                layout={LinearTransition}
              >
                {_featureItem(item)}
              </Animated.View>
            ))}
          </Animated.View>
        </Animated.ScrollView>
      </View>

      <Switcher value={value} setValue={setValue} />

      <Pressable
        onPress={simulatePress}
        className="self-stretch mx-5 mb-5 p-4 items-center rounded-full bg-white"
      >
        <Text className="text-black text-lg font-bold">Upgrade to SuperGrok</Text>
      </Pressable>

      <View className="w-full flex-row px-6 mb-8 items-center justify-between self-center">
        <Text onPress={simulatePress} className="text-[#616161] text-sm font-medium">
          Terms & Conditions
        </Text>
        <View className="border-l border-[#616161] border-[0.5px] h-3/4" />
        <Text onPress={simulatePress} className="text-[#616161] text-sm font-medium">
          Privacy Policy
        </Text>
        <View className="border-l border-[#616161] border-[0.5px] h-3/4" />
        <Text onPress={simulatePress} className="text-[#616161] text-sm font-medium">
          Restore Purchases
        </Text>
      </View>
    </View>
  );
};
