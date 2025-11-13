import { Pressable, TextInput, View } from "react-native";
import { FC } from "react";
import { Mic, Plus, Search } from "lucide-react-native";
import Animated, { SharedValue, withSpring } from "react-native-reanimated";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

type DynamicInputProps = {
  ref: React.Ref<TextInput>;
  value: string;
  setValue: (text: string) => void;
  focusProgress: SharedValue<number>;
  borderRadius: number;
};

const DynamicInput: FC<DynamicInputProps> = ({
  ref,
  value,
  setValue,
  focusProgress,
  borderRadius,
}) => {
  return (
    <Animated.View
      style={{ borderCurve: "continuous", borderRadius }}
      className="mx-3 p-3 bg-neutral-800 pt-[6px] border border-neutral-700/50"
    >
      <TextInput
        ref={ref}
        value={value}
        onChangeText={setValue}
        placeholder="Ask a follow up..."
        placeholderTextColor="#737373"
        selectionColor="#ffffff"
        className="pl-2 text-neutral-50 text-lg/5 font-medium mt-2"
        multiline
        numberOfLines={5}
        onFocus={() => {}}
        onBlur={() => {
          focusProgress.set(withSpring(0));
        }}
      />

      <View className="flex-row justify-between mt-9">
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={simulatePress}
            className="p-2 rounded-full bg-neutral-700 items-center justify-center"
          >
            <Plus size={18} color="white" />
          </Pressable>

          <Pressable
            onPress={simulatePress}
            className="p-2 rounded-full bg-neutral-700 items-center justify-center"
          >
            <Search size={18} color="white" />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={simulatePress}
            className="p-2 rounded-full bg-neutral-700 items-center justify-center"
          >
            <Mic size={18} color="white" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default DynamicInput;
