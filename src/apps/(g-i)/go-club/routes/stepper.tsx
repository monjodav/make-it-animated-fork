import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DigitalWheel } from "../components/stepper/digital-wheel";
import { CounterControls } from "../components/stepper/counter-controls";
import { DigitalCounterProvider } from "../lib/digital-counter-context";

const MIN_VALUE = 0;
const MAX_VALUE = 9;
const STEP_VALUE = 1;

export const Stepper = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const previousIndex = useSharedValue(-1);
  const currentIndex = useSharedValue(0);

  return (
    <DigitalCounterProvider min={MIN_VALUE} max={MAX_VALUE} step={STEP_VALUE}>
      <View
        className="flex-1 items-center justify-center bg-[#140D8C]"
        style={{ paddingTop: safeAreaInsets.top }}
      >
        <CounterControls />
        <DigitalWheel currentIndex={currentIndex} previousIndex={previousIndex} />
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
