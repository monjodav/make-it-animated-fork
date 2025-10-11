import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AlignHorizontalDistributeCenter,
  Backpack,
  CaseUpper,
  Cloud,
  FileTerminal,
  Sparkle,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import Animated, { FadeIn, FadeOut, Keyframe, LinearTransition } from "react-native-reanimated";
import PeriodControl from "../components/paywall/period-control";
import PlanControl from "../components/paywall/plan-control";
import { ProgressiveBlurView } from "@/src/shared/components/progressive-blur-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useDrawerControl } from "@/src/shared/lib/hooks/use-drawer-control";

const PRICE = {
  monthly: [9.99, 19.99],
  yearly: [96.0, 191.99],
};

const KEYFRAME_IN = new Keyframe({
  0: {
    opacity: 0.4,
    transform: [{ scale: 0.4 }],
  },
  60: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
});

const KEYFRAME_OUT = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ scale: 0 }],
  },
});

export const Paywall = () => {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedCard, setSelectedCard] = useState<"1" | "2">("1");
  const [bottomContentHeight, setBottomContentHeight] = useState(0);

  const insets = useSafeAreaInsets();

  const currentPrice = PRICE[period][selectedCard === "1" ? 0 : 1];
  const formattedPrice = `${currentPrice.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

  const { closeDrawer } = useDrawerControl();

  const _cardOne = (
    <Animated.View key="one" className="width-full py-3">
      <Text className="text-[#E0E0E1] text-2xl font-semibold self-center text-center mt-8">
        Unlock the most intelligent models
      </Text>
      <View className="flex-1 bg-neutral-700/60 rounded-3xl mt-5 p-4">
        <View className="flex-row flex-1 items-start">
          <View className="rounded-[5px] p-1 bg-red-900">
            <Sparkle size={14} color={"red"} strokeWidth={3} />
          </View>
          <View className="flex-1">
            <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">
              Access additional 20+ frontier models
            </Text>
            <Text className="text-[#92888A] font-semibold ml-3">
              GPT-4.1, o3, Claude 3.7 Sonnet, Gemini 2.5 Pro, Grok-3 & more
            </Text>

            <Text
              className={
                "text-[#E0E0E1] font-semibold ml-4 py-2 px-4 mt-5 self-start bg-neutral-700/60 rounded-full"
              }
            >
              Compare
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const _cardTwo = (
    <Animated.View key="two" className="width-full py-3">
      <Text className="text-[#E0E0E1] text-2xl font-semibold self-center text-center mt-8">
        New Level Unlocked
      </Text>
      <View className="flex-1 bg-neutral-700/60 rounded-3xl mt-5 p-4">
        <View className="flex-row flex-1 items-start">
          <View className="rounded-[5px] p-1 bg-red-900">
            <Sparkle size={14} color={"red"} strokeWidth={3} />
          </View>
          <View className="flex-1">
            <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">
              Chat with 26+ models in one interface
            </Text>
            <Text className="text-[#92888A] font-semibold ml-3">
              GPT-4.1 mini, Claude 3.5 Haiku, Gemini 2.5 Flash, Grok-3 mini & more
            </Text>
          </View>
        </View>
        <View className="h-[0.5px] bg-[#92888A] ml-11 -mr-4 my-4" />
        <View className="flex-row flex-1 items-start">
          <View className="rounded-[5px] p-1 bg-violet-500">
            <Cloud size={14} color={"white"} strokeWidth={3} />
          </View>
          <View className="flex-1">
            <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">Stay in sync</Text>
            <Text className="text-[#92888A] font-semibold ml-3">
              Backup and sync your content to access on all your devices (iOS & macOS)
            </Text>
          </View>
        </View>
        <View className="h-[0.5px] bg-[#92888A] ml-11 -mr-4 my-4" />
        <View className="flex-row flex-1 items-center">
          <View className="rounded-[5px] p-1 bg-neutral-300">
            <Backpack size={14} color={"black"} strokeWidth={3} />
          </View>
          <View className="flex-1">
            <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">Custom app icons</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const _cardThree = (
    <Animated.View key="three" className="width-full py-3">
      <Text className="text-[#E0E0E1] text-2xl font-semibold self-center text-center mt-8">
        Power-up your Mac
      </Text>
      <View className="flex-1 bg-neutral-700/60 rounded-3xl mt-5 p-4">
        <View className="flex-row flex-1 items-center">
          <View className="rounded-[5px] p-1 bg-red-900">
            <Sparkle size={14} color={"red"} strokeWidth={3} />
          </View>
          <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">AI Extensions</Text>
        </View>
        <View className="h-[0.5px] bg-[#92888A] ml-11 -mr-4 my-4" />
        <View className="flex-row flex-1 items-center">
          <View className="rounded-[5px] p-1 bg-red-400">
            <CaseUpper size={14} color={"white"} strokeWidth={3} />
          </View>
          <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">Unlimited Raycast Notes</Text>
        </View>
        <View className="h-[0.5px] bg-[#92888A] ml-11 -mr-4 my-4" />
        <View className="flex-row flex-1 items-center">
          <View className="rounded-[5px] p-1 bg-red-400">
            <FileTerminal size={14} color={"white"} strokeWidth={3} />
          </View>
          <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">
            Unlimited Clipboard History
          </Text>
        </View>
        <View className="h-[0.5px] bg-[#92888A] ml-11 -mr-4 my-4" />
        <View className="flex-row flex-1 items-center">
          <View className="rounded-[5px] p-1 bg-blue-300">
            <AlignHorizontalDistributeCenter size={14} color={"white"} strokeWidth={3} />
          </View>
          <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">
            Custom Window Management
          </Text>
        </View>
        <View className="h-[0.5px] bg-[#92888A] ml-11 -mr-4 my-4" />
        <View className="flex-row flex-1 items-center">
          <View className="rounded-[5px] p-1 bg-[transparent]">
            <AlignHorizontalDistributeCenter size={14} color={"transparent"} strokeWidth={3} />
          </View>
          <Text className="text-[#E0E0E1] text-lg font-semibold ml-3">& More</Text>
        </View>
      </View>
    </Animated.View>
  );

  const baseCards =
    selectedCard === "1" ? [_cardTwo, _cardThree] : [_cardOne, _cardTwo, _cardThree];

  const enteringBuilder = KEYFRAME_IN.duration(430);
  const exitingBuilder = KEYFRAME_OUT.duration(200);
  const layoutBuilder = LinearTransition.springify().damping(18).stiffness(160);

  const visibleCards = baseCards.map((card, index) => {
    const animationProps: any = {
      entering: enteringBuilder,
      exiting: exitingBuilder,
      layout: layoutBuilder,
    };
    return React.cloneElement(card as any, animationProps);
  });

  return (
    <View className="flex-1 bg-black">
      <Image
        style={StyleSheet.absoluteFill}
        placeholder={{
          blurhash:
            "_98_5KFH$6$6WoWpwx|dFHo1sUsUjto1JROCN[N]wysUSMsVwya|N]a|sUa|wywxo1jtSLWpo1N[jtWpo1a|Wpo1Wpa|jtWpjtjtfQwya|sUWpWpa|Wpo1a|jtjta|WpWp",
        }}
      />

      <View
        className="absolute flex-row items-center justify-between w-full px-6"
        style={{ top: insets.top + 8 }}
      >
        <Pressable
          onPress={closeDrawer}
          className="rounded-full p-2 overflow-hidden bg-neutral-700/30"
        >
          <BlurView tint="systemThickMaterialDark" style={StyleSheet.absoluteFill} />
          <X size={20} color="#d4d4d4" />
        </Pressable>
        <Text onPress={simulatePress} className="text-neutral-400 text-lg">
          Restore
        </Text>
      </View>

      <ScrollView
        contentContainerClassName="px-5"
        contentContainerStyle={{
          paddingTop: insets.top + 70,
          paddingBottom: bottomContentHeight - 30,
        }}
      >
        <Text className="text-neutral-50 w-3/4 text-3xl font-bold self-center text-center">
          Powerful Productivity for IOS and macOS
        </Text>

        <Animated.View layout={layoutBuilder}>{visibleCards}</Animated.View>
      </ScrollView>

      <ProgressiveBlurView height={insets.top + 12} blurViewProps={{ tint: "dark" }} />

      <ProgressiveBlurView
        key={bottomContentHeight}
        height={bottomContentHeight + 100}
        position="bottom"
        blurViewProps={{ intensity: 100, tint: "dark" }}
      />

      <LinearGradient colors={["#00000000", "#000000"]} style={styles.bottomGradient} />

      <View
        className="absolute bottom-0 px-5"
        style={{ paddingBottom: insets.bottom + 4 }}
        onLayout={(e) => setBottomContentHeight(e.nativeEvent.layout.height)}
      >
        <View className="items-center">
          <PeriodControl value={period} setValue={setPeriod} />
        </View>

        <PlanControl
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          price={PRICE}
          period={period}
        />

        <Pressable
          onPress={simulatePress}
          className="mb-4 p-4 items-center rounded-[15px] bg-white"
        >
          <Text className="text-black text-xl font-semibold">Try free for 2 weeks</Text>
        </Pressable>

        <Animated.Text
          key={formattedPrice + period}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="text-neutral-50 text-sm font-medium mb-2 text-center"
        >
          {`2 weeks free, then ${formattedPrice} per ${period.slice(0, -2)}. Auto-renews ${period} until cancelled.`}
        </Animated.Text>
        <View className="w-full flex-row mb-8 items-center justify-center gap-5">
          <Pressable onPress={simulatePress}>
            <Text className="text-neutral-400 text-sm font-medium">Terms of Service</Text>
          </Pressable>
          <Pressable onPress={simulatePress}>
            <Text className="text-neutral-400 text-sm font-medium">Privacy Policy</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});
