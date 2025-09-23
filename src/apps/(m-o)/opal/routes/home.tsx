import { FC, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import TimeSlider from "../components/time-slider";
import StartTimerButton from "../components/start-timer-button";
import AnimatedDashedBorder from "../components/animated-dashed-border";

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
      <AnimatedDashedBorder
        strokeWidth={1.5}
        dashLength={5}
        gapLength={4}
        animationSpeed={2000}
        borderRadius={20}
        strokeColor={"#302D30"}
        style={{
          marginBottom: "auto",
          marginTop: 80,
          marginHorizontal: 15,
        }}
      >
        <View className="items-center justify-center py-5 bg-[#0C080C] rounded-[20]">
          <View className="mb-1.5 p-3 rounded-[10] border-[#4C494C] border bg-[#2D2B2E]">
            <Plus size={20} color="#8D8B8D" strokeWidth={3} />
          </View>
          <Text className="text-white font-semibold text-lg">Limit App or Website</Text>
        </View>
      </AnimatedDashedBorder>

      <View className="w-screen mb-4 pr-4 flex-row items-center">
        <View
          className="absolute left-4 bg-white justify-center items-center"
          style={{
            height: HEIGHT,
            width: width * 0.2,
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
