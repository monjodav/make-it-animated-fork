import { Platform, Pressable, TextInput, View, StyleSheet } from "react-native";
import { Search, X } from "lucide-react-native";
import { useAnimationsStore } from "../../lib/store/animations";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { FC } from "react";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";

const HEIGHT = 48;

type SearchBarProps = {
  textInputRef: React.RefObject<TextInput | null>;
};

export const SearchBar: FC<SearchBarProps> = ({ textInputRef }) => {
  const query = useAnimationsStore((state) => state.query);
  const setQuery = useAnimationsStore((state) => state.setQuery);
  const clearQuery = useAnimationsStore((state) => state.clearQuery);

  const { progress } = useReanimatedKeyboardAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(progress.get() > 0 ? 1 : 0, { duration: 200 }),
      pointerEvents: progress.get() > 0 ? "auto" : "none",
    };
  });

  return (
    <KeyboardStickyView>
      <Animated.View
        className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-background border-neutral-700"
        style={[rContainerStyle, { borderTopWidth: StyleSheet.hairlineWidth }]}
      >
        <View
          className="flex-row items-center gap-2 rounded-2xl px-3 mb-1 overflow-hidden"
          style={{
            height: HEIGHT,
            backgroundColor: Platform.OS === "ios" ? "#515151" : "#1C1C1C",
            borderWidth: Platform.OS === "ios" ? 0 : 1,
            borderColor: Platform.OS === "ios" ? "transparent" : "#303030",
            borderCurve: "continuous",
          }}
        >
          {Platform.OS === "ios" ? (
            <>
              <View className="absolute h-full left-0.5 right-0.5 top-1 bg-[#1C1C1C] rounded-2xl shadow-[-4_-3_3_#1C1C1C]" />
              <View className="absolute h-full left-0.5 right-0.5 top-1 bg-[#1C1C1C] rounded-2xl shadow-[4_-3_3_#1C1C1C]" />
            </>
          ) : null}
          <Search size={16} color="#B2ACA9" className="self-center mr-2" strokeWidth={2.5} />
          <TextInput
            ref={textInputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Animation..."
            placeholderTextColor="#B2ACA9"
            selectionColor="#fffff4"
            className="flex-1 text-foreground text-lg/6 font-sans-medium pb-0.5"
          />
          {query.length > 0 && (
            <Pressable onPress={clearQuery} hitSlop={16}>
              <X size={16} color="#B2ACA9" strokeWidth={2.5} />
            </Pressable>
          )}
        </View>
      </Animated.View>
    </KeyboardStickyView>
  );
};
