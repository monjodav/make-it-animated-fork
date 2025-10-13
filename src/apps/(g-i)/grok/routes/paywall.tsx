import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChartNoAxesColumn,
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
import Animated from "react-native-reanimated";
import { FeatureItem } from "../components/paywall/feature-item";
import { cn } from "@/src/shared/lib/utils/cn";
import { useDrawerControl } from "@/src/shared/lib/hooks/use-drawer-control";
import UpgradeButton from "../components/paywall/upgrade-button";
import PlanControl from "../components/paywall/plan-control";

// grok-paywall-screen-animation 🔽

// Animation notes:
// - LinearTransition: used below to animate vertical spacing changes when plan toggles
// - Easing.out(Easing.ease) + 150ms: quick, soft layout updates that avoid feeling sluggish

const ICON_COLOR = "#fafafa";
const STROKE_WIDTH = 3;

export const Paywall = () => {
  const [value, setValue] = useState("1");

  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const { openDrawer } = useDrawerControl();

  // Image height: 25% of screen for a lightweight parallax-style header area
  // Used to compute content top padding so the list starts under the image
  const _imageHeight = height * 0.25;

  return (
    <View style={{ paddingBottom: insets.bottom + 8 }} className="flex-1 bg-black">
      <Image
        style={{ position: "absolute", top: 0, width, height: _imageHeight }}
        placeholder={{
          blurhash:
            "i02rmu?b004.-A-UtmNHD$-=fRI9ogx]WURkf5j[009E~q^+OsELMc$*-=8^oL?wRiD$s:tQkXof~q?c9[4.MI-V.9I:IA",
        }}
      />
      <Pressable
        onPress={openDrawer}
        style={{ marginTop: insets.top + 8 }}
        className="absolute rounded-full left-4 z-10 p-2.5 bg-neutral-900"
      >
        <X size={16} color="#737373" strokeWidth={3} />
      </Pressable>

      <View className="flex-1">
        <ScrollView
          contentContainerClassName="px-5 pb-10"
          // Top padding ties list start to header image height; 0.7 keeps title partially over image
          contentContainerStyle={{ paddingTop: _imageHeight * 0.7 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-neutral-50 text-5xl font-semibold self-center mb-3">SuperGrok</Text>
          <Text className="text-neutral-50 text-2xl font-semibold self-center text-center mb-12">
            Introducing Grok 4 Fast: the most intelligent fast model
          </Text>
          <Animated.View
            // Slight gap change per plan creates a subtle density shift on toggle
            className={cn("gap-[28px]", value === "2" && "gap-[26px]")}
          >
            <FeatureItem
              icon={
                value === "1" ? (
                  <Sparkle size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                ) : (
                  <Orbit size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                )
              }
              text={value === "1" ? "Higher usage on Fast & Expert" : "Everything in SuperGrok"}
            />
            <FeatureItem
              icon={
                value === "1" ? (
                  <ChartNoAxesColumn size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                ) : (
                  <Lightbulb size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                )
              }
              text={
                value === "1" ? "Higher usage on Fast & Expert" : "Highest usage on Fast & Expert"
              }
            />
            <FeatureItem
              icon={
                value === "1" ? (
                  <ImagePlus size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                ) : (
                  <Rocket size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                )
              }
              text={value === "1" ? "Higher usage on Voice Mode and Companions" : "Access to Heavy"}
            />
            <FeatureItem
              icon={
                value === "1" ? (
                  <ThumbsUp size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                ) : (
                  <ImagePlus size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />
                )
              }
              text={
                value === "1" ? "Early access to new features" : "Highest usage on Grok Imagine"
              }
            />
            {value === "2" && (
              <>
                <FeatureItem
                  icon={<Sparkle size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />}
                  text="Early access to new features"
                />
                <FeatureItem
                  icon={<Sparkle size={20} color={ICON_COLOR} strokeWidth={STROKE_WIDTH} />}
                  text="Dedicated support"
                />
              </>
            )}
          </Animated.View>
        </ScrollView>
      </View>

      <PlanControl value={value} setValue={setValue} />

      {/* grok-paywall-upgrade-button-animation 🔽 */}
      <UpgradeButton />
      {/* grok-paywall-upgrade-button-animation 🔼 */}

      <View className="w-full flex-row px-6 mb-8 items-center justify-between self-center">
        <Pressable onPress={simulatePress}>
          <Text className="text-neutral-500 text-sm font-medium">Terms & Conditions</Text>
        </Pressable>
        <View className="border-l border-neutral-600 border-[0.5px] h-3/4" />
        <Pressable onPress={simulatePress}>
          <Text className="text-neutral-500 text-sm font-medium">Privacy Policy</Text>
        </Pressable>
        <View className="border-l border-neutral-600 border-[0.5px] h-3/4" />
        <Pressable onPress={simulatePress}>
          <Text className="text-neutral-500 text-sm font-medium">Restore Purchases</Text>
        </Pressable>
      </View>
    </View>
  );
};

// grok-paywall-screen-animation 🔼
