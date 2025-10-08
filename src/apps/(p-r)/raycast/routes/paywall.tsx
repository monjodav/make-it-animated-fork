import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
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
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import Switcher from "../components/paywall/switcher";
import TabsSwitcher from "../components/paywall/tabs-switcher";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import TopBlur from "../components/paywall/top-blur";
import BottomBlur from "../components/paywall/bottom-blur";

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
  { id: "g7", icon: "Orbit", title: "Everything in SuperGrok" },
  { id: "g8", icon: "Rocket", title: "Access to Heavy" },
  { id: "g9", icon: "Lightbulb", title: "Highest usage on Fast & Expert" },
  { id: "g10", icon: "ImagePlus", title: "Highest usage on Grok Imagine" },
  { id: "g11", icon: "Sparkle", title: "Early access to new features" },
  { id: "g12", icon: "Heart", title: "Dedicated support" },
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

const PRICE = {
  monthly: [9.99, 19.99],
  yearly: [96.0, 191.99],
};

export const Paywall = () => {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedCard, setSelectedCard] = useState<"1" | "2">("1");
  const [overlayHeight, setOverlayHeight] = useState(0);

  const currentFeatures = selectedCard === "1" ? FEATURES_BLOCK_ONE : FEATURES_BLOCK_TWO;
  const currentPrice = PRICE[period][selectedCard === "1" ? 0 : 1];
  const formattedPrice = `${currentPrice.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 items-center bg-black">
      <View
        style={{ marginTop: insets.top }}
        className="absolute flex-row items-center justify-between w-full px-6 py-5 z-10 "
      >
        <TopBlur />

        <Pressable
          onPress={simulatePress}
          className="rounded-full p-2 overflow-hidden bg-neutral-700/50"
        >
          <BlurView tint="dark" style={StyleSheet.absoluteFill} />
          <X size={20} color="#E0E0E1" strokeWidth={3} />
        </Pressable>
        <Text onPress={simulatePress} className="text-[#E0E0E1] text-lg font-medium">
          Restore
        </Text>
      </View>

      <Image
        style={{ width: "100%", height: "100%", position: "absolute", top: insets.top }}
        placeholder={{
          blurhash:
            "_98_5KFH$6$6WoWpwx|dFHo1sUsUjto1JROCN[N]wysUSMsVwya|N]a|sUa|wywxo1jtSLWpo1N[jtWpo1a|Wpo1Wpa|jtWpjtjtfQwya|sUWpWpa|Wpo1a|jtjta|WpWp",
        }}
      />
      <View className="flex-1 w-full relative">
        <Animated.ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerClassName="px-5 pt-[80]"
          contentContainerStyle={{ paddingBottom: overlayHeight + insets.bottom + 24 }}
        >
          <Text className="text-[#E0E0E1] text-3xl font-bold self-center text-center">
            Powerful Productivity for IOS and macOS
          </Text>
          <Text className="text-[#E0E0E1] text-2xl font-semibold self-center text-center mt-8">
            New Level Unlocked
          </Text>
          <Animated.View layout={LinearTransition}>
            {currentFeatures.map((item, idx) => (
              <Animated.View
                key={`${period}-${item.id}`}
                className={"flex-row width-full py-3 items-center justify-between"}
                entering={FadeIn}
                exiting={FadeOut}
                layout={LinearTransition}
              >
                {_featureItem(item)}
              </Animated.View>
            ))}
          </Animated.View>
        </Animated.ScrollView>

        <View
          className="w-full px-6 items-center"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          onLayout={(e) => setOverlayHeight(e.nativeEvent.layout.height)}
        >
          <BottomBlur />

          <Switcher value={period} setValue={setPeriod} />

          <TabsSwitcher
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
            price={PRICE}
            period={period}
          />

          <Pressable
            onPress={simulatePress}
            className="self-stretch mb-4 p-4 items-center rounded-[15px] bg-white"
          >
            <Text className="text-black text-xl font-semibold">Try free for 2 weeks</Text>
          </Pressable>

          <Text
            onPress={simulatePress}
            className="text-[#ffffff] text-sm font-medium mb-1 text-center"
          >
            {`2 weeks free, then ${formattedPrice} per ${period.slice(0, -2)}. Auto-renews ${period} until cancelled.`}
          </Text>
          <View className="w-full flex-row mb-8 items-center justify-center gap-5">
            <Text onPress={simulatePress} className="text-[#616161] text-sm font-medium">
              Terms of Service
            </Text>
            <Text onPress={simulatePress} className="text-[#616161] text-sm font-medium">
              Privacy Policy
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
