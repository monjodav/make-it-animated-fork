import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
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
import Animated, { BounceIn, FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import Switcher from "../components/paywall/switcher";
import TabsSwitcher from "../components/paywall/tabs-switcher";
import { BlurView } from "expo-blur";
import TopBlur from "../components/paywall/top-blur";
import BottomBlur from "../components/paywall/bottom-blur";

const PRICE = {
  monthly: [9.99, 19.99],
  yearly: [96.0, 191.99],
};

export const Paywall = () => {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [selectedCard, setSelectedCard] = useState<"1" | "2">("1");
  const [overlayHeight, setOverlayHeight] = useState(0);

  const currentPrice = PRICE[period][selectedCard === "1" ? 0 : 1];
  const formattedPrice = `${currentPrice.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

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

  const buildEntering = (index: number) =>
    BounceIn.withInitialValues({
      transform: [{ scale: 0.9 }],
      opacity: 0,
    })
      .springify()
      .damping(22)
      .stiffness(180)
      .mass(0.85)
      .delay(index * 70);

  const exitingBuilder = FadeOut.springify().damping(18).stiffness(150).mass(0.8);
  const layoutBuilder = LinearTransition.springify().damping(16).stiffness(160);

  const visibleCards = baseCards.map((card, index) => {
    const animationProps: any = {
      entering: buildEntering(index),
      exiting: exitingBuilder,
      layout: layoutBuilder,
    };
    return React.cloneElement(card as any, animationProps);
  });

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
          <Text className="text-[#E0E0E1] w-3/4 text-3xl font-bold self-center text-center">
            Powerful Productivity for IOS and macOS
          </Text>

          <Animated.View layout={layoutBuilder}>{visibleCards}</Animated.View>
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
