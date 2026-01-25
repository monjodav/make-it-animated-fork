import { FC } from "react";
import { Pressable, View } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { useDigitalCounter } from "../../lib/digital-counter-context";

/**
 * Counter controls component with side-by-side increment/decrement buttons.
 * Buttons are contained within a rounded container with semi-transparent background.
 */
export const CounterControls: FC = () => {
  const { handleIncrement, handleDecrement } = useDigitalCounter();

  return (
    <View className="flex-row items-center rounded-xl bg-white/5 overflow-hidden">
      <Pressable onPress={handleDecrement} className="px-4 py-2 items-center justify-center">
        <Minus size={20} color="#ffffff" />
      </Pressable>
      <View className="w-px h-6 bg-white/20" />
      <Pressable onPress={handleIncrement} className="px-4 py-2 items-center justify-center">
        <Plus size={20} color="#ffffff" />
      </Pressable>
    </View>
  );
};
