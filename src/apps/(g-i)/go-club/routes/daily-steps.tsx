import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CounterControls } from "../components/daily-steps/counter-controls";
import { DigitalCounterProvider } from "../lib/digital-counter-context";
import { DigitalCounter } from "../components/daily-steps/digital-counter";

const MIN_VALUE = 10000;
const MAX_VALUE = 32000;
const STEP_VALUE = 500;

export const DailySteps = () => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <DigitalCounterProvider min={MIN_VALUE} max={MAX_VALUE} step={STEP_VALUE}>
      <View
        className="flex-1 justify-center bg-[#140D8C]"
        style={{ paddingTop: safeAreaInsets.top }}
      >
        <CounterControls />
        <DigitalCounter />
      </View>
    </DigitalCounterProvider>
  );
};
