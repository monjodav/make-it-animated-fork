import { FC } from "react";
import { Pressable, View } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { useDigitalCounter } from "../../lib/digital-counter-context";

export const CounterControls: FC = () => {
  const { handleIncrement, handleDecrement } = useDigitalCounter();

  return (
    <View className="flex-row items-center">
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
