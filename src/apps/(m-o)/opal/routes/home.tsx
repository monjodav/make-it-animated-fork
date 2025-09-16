import React, { FC } from "react";
import { Dimensions, View, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TimeSlider from "../components/time-slider";

export const Home: FC = () => {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get("window").width;

  return (
    <View className="flex-1 bg-black justify-end" style={{ paddingTop: insets.top }}>
      <View className="w-screen mb-1 pr-4">
        <View
          className="absolute left-4 bg-white"
          style={{
            height: 40,
            width: 40 * 2.1,
            borderRadius: 15,
          }}
        />
        <View className="ml-auto">
          <TimeSlider sliderWidth={width * 0.7} sliderHeight={40} step={30} />
        </View>
      </View>
      <View className="justify-center items-center flex-row gap-2 h-[50] my-5 rounded-full border-[2] border-[#636164] bg-gray-300 mx-4">
        <FontAwesome6 name="play" size={20} color="white" />
        <Text className="text-white text-xl">Start Timer</Text>
      </View>
    </View>
  );
};
