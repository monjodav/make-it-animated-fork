import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChartNoAxesColumn, Check, ImagePlus, Sparkle, ThumbsUp, X } from "lucide-react-native";

export const Paywall = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 items-center bg-black">
      <Pressable
        onPress={() => {}}
        style={{ marginTop: insets.top + 5 }}
        className="absolute rounded-full left-5 z-10 p-2 bg-[#1A1A1A]"
      >
        <X size={14} color="#616161" strokeWidth={4} />
      </Pressable>
      <View style={{ flex: 1, width: "100%", position: "relative" }}>
        <Image
          style={{ width: "100%", aspectRatio: 1.3 }}
          placeholder={{ blurhash: "L141@5$*00M{%Ns:IARk00I:~Wxa" }}
          //   placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
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
      <View className="self-stretch mx-5 mb-5 p-4 items-center rounded-full bg-white">
        <Text className="text-black text-lg font-bold">Update to SuperGrok</Text>
      </View>
      <View className="w-full flex-row px-6 mb-8 items-center justify-between self-center">
        <Text className="text-[#616161] text-sm font-medium">Terms & Conditions</Text>
        <View className="border-l border-[#616161] border-[0.5px] h-3/4" />
        <Text className="text-[#616161] text-sm font-medium">Privacy Policy</Text>
        <View className="border-l border-[#616161] border-[0.5px] h-3/4" />
        <Text className="text-[#616161] text-sm font-medium">Restore Purchases</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
