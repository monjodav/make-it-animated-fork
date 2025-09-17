import React, { FC, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TimeSlider from "../components/time-slider";
import StartTimerButton from "../components/start-timer-button";

const HEIGHT = 44;

export const Home: FC = () => {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get("window").width;
  const [sliderValue, setSliderValue] = useState(5);

  const formatMinutes = (m: number) => {
    const hours = Math.floor(m / 60);
    const minutes = m % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <View className="flex-1 bg-black justify-end" style={{ paddingTop: insets.top }}>
      <View className="w-screen mb-4 pr-4 flex-row items-center">
        <View
          className="absolute left-4 bg-white justify-center items-center"
          style={{
            height: HEIGHT,
            width: 80,
            borderRadius: 15,
          }}
        >
          <Text className="text-xl">{formatMinutes(sliderValue)}</Text>
        </View>
        <View className="ml-auto">
          <TimeSlider
            sliderWidth={width * 0.7}
            sliderHeight={HEIGHT}
            dividerCount={35}
            min={5}
            max={180}
            onValueChange={(value) => setSliderValue(value)}
          />
        </View>
      </View>

      <StartTimerButton />
    </View>
  );
};
