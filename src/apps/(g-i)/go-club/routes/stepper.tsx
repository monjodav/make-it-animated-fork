import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CounterControls } from "../components/stepper/counter-controls";
import { DigitalCounterProvider } from "../lib/digital-counter-context";
import { DigitalCounter } from "../components/stepper/digital-counter";

const MIN_VALUE = 10000;
const MAX_VALUE = 30000;
const STEP_VALUE = 500;

export const Stepper = () => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <DigitalCounterProvider min={MIN_VALUE} max={MAX_VALUE} step={STEP_VALUE}>
      <View
        className="flex-1 items-center justify-center bg-[#140D8C]"
        style={{ paddingTop: safeAreaInsets.top }}
      >
        <CounterControls />
        <DigitalCounter />
        {/* <Text
          className="absolute opacity-0 text-white text-5xl font-bold"
          onLayout={(event) => {
            digitWidth.set(event.nativeEvent.layout.width);
            digitHeight.set(event.nativeEvent.layout.height);
          }}
          pointerEvents="none"
        >
          0
        </Text> */}
      </View>
    </DigitalCounterProvider>
  );
};
