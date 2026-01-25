import { FC } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus, Minus } from "lucide-react-native";
import { useDigitalCounter } from "../../lib/digital-counter-context";

export const CounterControls: FC = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { handleIncrement, handleDecrement } = useDigitalCounter();

  return (
    <View
      className="absolute top-[384px] left-0 right-0 flex-row items-center justify-between gap-4 px-12 py-3 z-10"
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
  );
};
