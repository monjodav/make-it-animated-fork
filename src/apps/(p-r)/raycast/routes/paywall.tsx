import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import React, { useRef, useState } from "react";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from "react-native-reanimated";
import PeriodControl from "../components/paywall/period-control";
import PlanControl from "../components/paywall/plan-control";
import { ProgressiveBlurView } from "@/src/shared/components/progressive-blur-view";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useDrawerControl } from "@/src/shared/lib/hooks/use-drawer-control";
import { FeaturesSection, FeatureItem, Divider } from "../components/paywall/features-section";
import { IconContainer } from "../components/paywall/features-section/icon-container";
import { GradientText } from "@/src/shared/components/gradient-text";

const PRICE = {
  monthly: [9.99, 19.99],
  yearly: [96.0, 191.99],
};

export const Paywall = () => {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [plan, setPlan] = useState<"pro" | "advanced">("pro");
  const [bottomContentHeight, setBottomContentHeight] = useState(0);

  const insets = useSafeAreaInsets();

  const currentPrice = PRICE[period][plan === "pro" ? 0 : 1];
  const formattedPrice = `${currentPrice} USD`;

  const { openDrawer } = useDrawerControl();

  const listRef = useRef<ScrollView>(null);

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
        className="absolute flex-row items-center justify-between w-full px-6 z-50"
        style={{ top: insets.top + 8 }}
      >
        <Pressable
          onPress={openDrawer}
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
        ref={listRef}
        contentContainerClassName="px-5 gap-10"
        contentContainerStyle={{
          paddingTop: insets.top + 70,
          paddingBottom: bottomContentHeight - 24,
        }}
      >
        <GradientText
          text="Powerful Productivity for IOS and macOS"
          className="text-neutral-50 w-3/4 text-3xl font-bold self-center text-center"
          gradientProps={{ colors: ["#a3a3a390", "#fafafa", "#a3a3a390"] }}
        />

        {plan === "advanced" && (
          <FeaturesSection
            key="one"
            entering={ZoomIn.springify().damping(85).stiffness(800)}
            exiting={ZoomOut.springify().damping(85).stiffness(800)}
            title="Unlock the most intelligent models"
          >
            <FeatureItem
              icon={
                <IconContainer className="bg-red-900">
                  <Sparkle size={14} color={"red"} strokeWidth={3} />
                </IconContainer>
              }
              title="Access additional 20+ frontier models"
              description="GPT-4.1, o3, Claude 3.7 Sonnet, Gemini 2.5 Pro, Grok-3 & more"
            />
            <Pressable
              onPress={simulatePress}
              className="self-start py-1.5 px-4 bg-neutral-700/40 border border-neutral-600/30 rounded-full mt-7 ml-9"
            >
              <Text className="text-lg text-neutral-50 font-medium">Compare</Text>
            </Pressable>
          </FeaturesSection>
        )}

        <FeaturesSection key="two" title="New Level Unlocked">
          <FeatureItem
            icon={
              <IconContainer className="bg-red-900">
                <Sparkle size={14} color={"red"} strokeWidth={3} />
              </IconContainer>
            }
            title="Chat with 26+ models in one interface"
            description="GPT-4.1 mini, Claude 3.5 Haiku, Gemini 2.5 Flash, Grok-3 mini & more"
          />
          <Divider />
          <FeatureItem
            icon={
              <IconContainer className="bg-violet-500">
                <Cloud size={14} color={"white"} strokeWidth={3} />
              </IconContainer>
            }
            title="Stay in sync"
            description="Backup and sync your content to access on all your devices (iOS & macOS)"
          />
          <Divider />
          <FeatureItem
            icon={
              <IconContainer className="bg-neutral-300">
                <Backpack size={14} color={"black"} strokeWidth={3} />
              </IconContainer>
            }
            title="Custom app icons"
          />
        </FeaturesSection>

        <FeaturesSection key="three" title="Power-up your Mac">
          <FeatureItem
            icon={
              <IconContainer className="bg-red-900">
                <Sparkle size={14} color={"red"} strokeWidth={3} />
              </IconContainer>
            }
            title="AI Extensions"
          />
          <Divider />
          <FeatureItem
            icon={
              <IconContainer className="bg-red-400">
                <CaseUpper size={14} color={"white"} strokeWidth={3} />
              </IconContainer>
            }
            title="Unlimited Raycast Notes"
          />
          <Divider />
          <FeatureItem
            icon={
              <IconContainer className="bg-red-400">
                <FileTerminal size={14} color={"white"} strokeWidth={3} />
              </IconContainer>
            }
            title="Unlimited Clipboard History"
          />
          <Divider />
          <FeatureItem
            icon={
              <IconContainer className="bg-blue-300">
                <AlignHorizontalDistributeCenter size={14} color={"white"} strokeWidth={3} />
              </IconContainer>
            }
            title="Custom Window Management"
          />
          <Divider />
          <FeatureItem
            icon={
              <IconContainer className="bg-[transparent]">
                <AlignHorizontalDistributeCenter size={14} color={"transparent"} strokeWidth={3} />
              </IconContainer>
            }
            title="& More"
          />
        </FeaturesSection>
      </ScrollView>

      <ProgressiveBlurView height={insets.top + 60} blurViewProps={{ tint: "dark" }} />

      <ProgressiveBlurView
        key={bottomContentHeight}
        height={bottomContentHeight + 100}
        position="bottom"
        blurViewProps={{ intensity: 100, tint: "dark" }}
      />

      {Platform.OS === "ios" && (
        <LinearGradient
          colors={["#00000000", "#00000080"]}
          style={[styles.bottomGradient, { height: insets.bottom + 100 }]}
        />
      )}

      <View
        className="absolute bottom-0 px-5"
        style={{ paddingBottom: insets.bottom + 4 }}
        onLayout={(e) => setBottomContentHeight(e.nativeEvent.layout.height)}
      >
        <View className="items-center">
          <PeriodControl value={period} setValue={setPeriod} />
        </View>

        <PlanControl
          plan={plan}
          setPlan={setPlan}
          price={PRICE}
          period={period}
          listRef={listRef}
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
  },
});
