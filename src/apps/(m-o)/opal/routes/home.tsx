import React, { FC, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TimeSlider from "../components/time-slider";

export const Home: FC = () => {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get("window").width;
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <View className="flex-1 bg-black justify-end" style={{ paddingTop: insets.top }}>
      <View className="w-screen mb-1 pr-4 flex-row items-center">
        <View
          className="absolute left-4 bg-white justify-center items-center"
          style={{
            height: 44,
            width: 80,
            borderRadius: 15,
          }}
        >
          <Text className="text-xl font-semibold" style={{ color: "#1E1E20" }}>
            {sliderValue}
          </Text>
        </View>
        <View className="ml-auto">
          <TimeSlider
            sliderWidth={width * 0.7}
            sliderHeight={44}
            step={36}
            onValueChange={(value) => setSliderValue(value)}
          />
        </View>
      </View>
      <View className="justify-center items-center flex-row gap-2 h-[50] my-5 rounded-full border-[2] border-[#636164] bg-gray-300 mx-4">
        <FontAwesome6 name="play" size={20} color="white" />
        <Text className="text-white text-xl">Start Timer</Text>
      </View>
    </View>
  );
};
