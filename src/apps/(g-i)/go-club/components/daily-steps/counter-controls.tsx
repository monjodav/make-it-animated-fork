import { FC } from "react";
import { View } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { useDigitalCounter } from "../../lib/digital-counter-context";
import { CounterButton } from "./counter-button";

/**
 * Counter controls component with side-by-side increment/decrement buttons.
 * Buttons are contained within a rounded container with semi-transparent background.
 * Includes animated highlight overlay on press.
 */
export const CounterControls: FC = () => {
  const { handleIncrement, handleDecrement } = useDigitalCounter();

  return (
    <View className="flex-row items-center rounded-xl bg-white/5 overflow-hidden">
      <CounterButton onPress={handleDecrement} icon={<Minus size={20} color="#ffffff" />} />
      <View className="w-px h-6 bg-white/20" />
      <CounterButton onPress={handleIncrement} icon={<Plus size={20} color="#ffffff" />} />
    </View>
  );
};
