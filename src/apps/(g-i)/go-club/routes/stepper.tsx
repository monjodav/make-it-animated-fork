import { useCallback } from "react";
import { Pressable, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Minus } from "lucide-react-native";
import { DigitalWheel } from "../components/stepper/digital-wheel";

export const Stepper = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const previousIndex = useSharedValue(-1);
  const currentIndex = useSharedValue(0);

  const handleIncrement = useCallback(() => {
    if (currentIndex.get() === 9) return;
    previousIndex.set(currentIndex.get());
    currentIndex.set(Math.min(9, Math.floor(currentIndex.get()) + 1));
  }, [currentIndex, previousIndex]);

  const handleDecrement = useCallback(() => {
    if (currentIndex.get() === 0) return;
    previousIndex.set(currentIndex.get());
    currentIndex.set(Math.max(0, Math.ceil(currentIndex.get()) - 1));
  }, [currentIndex, previousIndex]);

  return (
    <View
      className="flex-1 items-center justify-center bg-[#140D8C]"
      style={{ paddingTop: safeAreaInsets.top }}
    >
      <View
        className="absolute top-[384px] left-0 right-0 flex-row items-center justify-between gap-4 px-24 py-3 z-10"
        style={{ paddingTop: safeAreaInsets.top }}
      >
        <Pressable
          onPress={handleDecrement}
          className="size-10 items-center justify-center rounded-full bg-white/20"
        >
          <Minus size={24} color="#ffffff" />
        </Pressable>
        <Pressable
          onPress={handleIncrement}
          className="size-10 items-center justify-center rounded-full bg-white/20"
        >
          <Plus size={24} color="#ffffff" />
        </Pressable>
      </View>
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
  );
};
