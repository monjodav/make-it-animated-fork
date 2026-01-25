import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { X } from "lucide-react-native";
import Carousel from "../components/carousel";
import { DurationControl } from "../components/duration-control";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

export const Steps = () => {
  const [duration, setDuration] = useState<"overall" | "today">("overall");

  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#140D8C]" style={{ paddingTop: safeAreaInsets.top }}>
      <View>
        <View className="items-center">
          <DurationControl value={duration} setValue={setDuration} />
        </View>
        <Pressable
          onPress={simulatePress}
          className="absolute right-6 p-3 self-start rounded-full bg-blue-950/70"
        >
          <X size={22} color="white" />
        </Pressable>
      </View>

      <Carousel />

      <Pressable
        onPress={simulatePress}
        className="flex-row items-center rounded-full bg-blue-600 px-10 py-5 self-center mt-auto gap-3"
        style={{ marginBottom: safeAreaInsets.bottom + 20, borderCurve: "continuous" }}
      >
        <FontAwesome6 name="share" size={16} color="white" />
        <Text className="text-white  font-semibold">Share</Text>
      </Pressable>
    </View>
  );
};
