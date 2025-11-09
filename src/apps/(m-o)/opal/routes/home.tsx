import { FC, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StartTimerButton from "../components/start-timer-button";
import TimeSlider from "../components/time-slider";

const HEIGHT = 44;

export const Home: FC = () => {
  const [sliderValue, setSliderValue] = useState(5);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const formatMinutes = (m: number) => {
    const hours = Math.floor(m / 60);
    const minutes = m % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <View className="flex-1 pb-2 bg-black justify-end" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center gap-10">
        <Text className="text-xl">{formatMinutes(sliderValue)}</Text>
        <TimeSlider
          sliderWidth={width * 0.7}
          sliderHeight={HEIGHT}
          dividerCount={35}
          min={5}
          max={180}
          onValueChange={(value) => setSliderValue(value)}
        />
      </View>
      {/* opal-start-timer-button-animation 🔽 */}
      <StartTimerButton />
      {/* opal-start-timer-button-animation 🔼 */}
    </View>
  );
};
