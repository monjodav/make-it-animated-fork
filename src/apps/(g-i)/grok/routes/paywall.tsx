import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChartNoAxesColumn, Check, ImagePlus, Sparkle, ThumbsUp, X } from "lucide-react-native";
import SegmentedControl from "@/src/shared/components/segment-control/segment-control";
import { useState } from "react";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

export const Paywall = () => {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState("1");

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 items-center bg-black">
      <Pressable
        onPress={simulatePress}
        style={{ marginTop: insets.top + 5 }}
        className="absolute rounded-full left-5 z-10 p-2 bg-[#1A1A1A]"
      >
        <X size={14} color="#616161" strokeWidth={4} />
      </Pressable>
      <View style={{ flex: 1, width: "100%", position: "relative" }}>
        <Image
          style={{ width: "100%", aspectRatio: 1.3 }}
          placeholder={{
            blurhash:
              "i02rmu?b004.-A-UtmNHD$-=fRI9ogx]WURkf5j[009E~q^+OsELMc$*-=8^oL?wRiD$s:tQkXof~q?c9[4.MI-V.9I:IA",
          }}
        />
        <ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerClassName="px-5 pt-[160]"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-[#E0E0E1] text-5xl font-semibold self-center">SuperGrok</Text>
          <Text className="text-[#E0E0E1] text-2xl font-semibold self-center text-center mt-1">
            Introducing Grok 4 Fast: the most intelligent fast model
          </Text>

          <View className="flex-row width-full py-3 items-center justify-between mt-7">
            <View className="flex-row flex-1 items-center">
              <Sparkle size={20} color={"#E0E0E1"} strokeWidth={3} />
              <Text className="text-[#E0E0E1] text-lg font-bold ml-3">
                Higher usage on Fast & Expert
              </Text>
            </View>
            <Check size={18} color={"#E0E0E1"} strokeWidth={3} />
          </View>
          <View className="flex-row width-full py-3 items-center justify-between">
            <View className="flex-row flex-1 items-center">
              <ImagePlus size={20} color={"#E0E0E1"} strokeWidth={3} />
              <Text className="text-[#E0E0E1] text-lg font-bold ml-3">
                Higher usage on Grock Imagine
              </Text>
            </View>
            <Check size={18} color={"#E0E0E1"} strokeWidth={3} />
          </View>
          <View className="flex-row width-full py-3 items-center justify-between">
            <View className="flex-row flex-1 items-center">
              <ChartNoAxesColumn size={20} color={"#E0E0E1"} strokeWidth={3} />
              <Text className="text-[#E0E0E1] text-lg font-bold ml-3">
                Higher usage on Voice Mode and Companions
              </Text>
            </View>
            <Check size={18} color={"#E0E0E1"} strokeWidth={3} />
          </View>
          <View className="flex-row width-full py-3 items-center justify-between">
            <View className="flex-row flex-1 items-center">
              <ThumbsUp size={20} color={"#E0E0E1"} strokeWidth={3} />
              <Text className="text-[#E0E0E1] text-lg font-bold ml-3">
                Early access to new features
              </Text>
            </View>
            <Check size={18} color={"#E0E0E1"} strokeWidth={3} />
          </View>
        </ScrollView>
      </View>

      <SegmentedControl
        value={value}
        onValueChange={setValue}
        className="bg-[#1A1A1A] mx-5 mb-7 self-center justify-between rounded-[20px]"
      >
        <SegmentedControl.Indicator className="bg-[#1A1A1A] rounded-[20px] border-[4px] border-white" />

        <SegmentedControl.Item
          value="1"
          pressScale={0.95}
          className="flex-1 px-5 py-4 rounded-full"
        >
          {({ isActive }) => (
            <>
              <Text
                className={
                  isActive ? "text-[#E0E0E1] text-lg font-bold" : "text-[#616161] text-lg font-bold"
                }
              >
                SuperGrok
              </Text>
              <View className="flex-row items-end">
                <Text
                  className={
                    isActive
                      ? "text-[#E0E0E1] text-2xl font-bold"
                      : "text-[#616161] text-2xl font-bold"
                  }
                >
                  40,00 USD
                </Text>
                <Text
                  className={
                    isActive
                      ? "text-[#E0E0E1] text-lg font-bold"
                      : "text-[#616161] text-lg font-bold"
                  }
                >
                  /mo
                </Text>
              </View>
            </>
          )}
        </SegmentedControl.Item>
        <SegmentedControl.Item
          value="2"
          pressScale={0.95}
          className="flex-1 px-5 py-4 rounded-full"
        >
          {({ isActive }) => (
            <>
              <Text
                className={
                  isActive ? "text-[#E0E0E1] text-lg font-bold" : "text-[#616161] text-lg font-bold"
                }
              >
                SuperGrok Heavy
              </Text>
              <View className="flex-row items-end">
                <Text
                  className={
                    isActive
                      ? "text-[#E0E0E1] text-2xl font-bold"
                      : "text-[#616161] text-2xl font-bold"
                  }
                >
                  400,00 U...
                </Text>
                <Text
                  className={
                    isActive
                      ? "text-[#E0E0E1] text-lg font-bold"
                      : "text-[#616161] text-lg font-bold"
                  }
                >
                  /mo
                </Text>
              </View>
            </>
          )}
        </SegmentedControl.Item>
      </SegmentedControl>

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

const styles = StyleSheet.create({});
