import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CounterControls } from "../components/daily-steps/counter-controls";
import { DigitalCounterProvider } from "../lib/digital-counter-context";
import { DigitalCounter } from "../components/daily-steps/digital-counter";
import { ScreenBackground } from "../components/daily-steps/screen-background";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// daily-steps-counter-animation 🔽

const MIN_VALUE = 10000;
const MAX_VALUE = 32000;
const STEP_VALUE = 500;

const INFO_TEXT =
  "10,000 steps: A popular goal that can help keep your heart healthy, control diabetes, and aid in weight loss.";

export const DailySteps = () => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <DigitalCounterProvider min={MIN_VALUE} max={MAX_VALUE} step={STEP_VALUE}>
      <View
        className="flex-1 justify-end bg-[#2D1EED]"
        style={{ paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom + 12 }}
      >
        <ScreenBackground />

        <View className="absolute inset-0 px-8 justify-center">
          <Text className="text-white text-5xl font-bold mb-6">Daily steps</Text>
          <View className="flex-row items-center justify-between mb-6 -ml-1.5">
            <DigitalCounter />
            <CounterControls />
          </View>

          <View className="gap-3">
            <FontAwesome6 name="circle-info" size={20} color="#ffffff" />
            <Text className="text-white text-sm leading-5">{INFO_TEXT}</Text>
          </View>
        </View>
        <Pressable
          onPress={simulatePress}
          className="bg-white rounded-full py-3.5 px-20 items-center justify-center self-center"
          style={{
            borderCurve: "continuous",
          }}
        >
          <Text className="text-indigo-800 font-semibold text-2xl">Done</Text>
        </Pressable>
      </View>
    </DigitalCounterProvider>
  );
};

// daily-steps-counter-animation 🔼
