import { Pressable, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  useAnimatedReaction,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Mic, PenLine, Plus, Search } from "lucide-react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANIMATION_DURATION = 350;
const PEN_ICON_SIZE = 62;
const GAP = 10;
const BASIC_INPUT_CONTAINER_HEIGHT = 62;
const FULL_INPUT_CONTAINER_HEIGHT = 110;
const PADDING = 14;

const AnimatedInput = () => {
  const insets = useSafeAreaInsets();

  const focusProgress = useSharedValue(0);

  const allowedWidth = useSharedValue(0);
  const bounceY = useSharedValue(0);

  useAnimatedReaction(
    () => focusProgress.get(),
    (current, prev) => {
      if (prev != null && prev > 0.01 && current <= 0.01) {
        bounceY.set(0);
        bounceY.set(withSequence(withTiming(3, { duration: 100 }), withTiming(0)));
      }
    }
  );
  const rMainContainerStyle = useAnimatedStyle(() => {
    const paddingBottom = interpolate(focusProgress.get(), [0, 1], [insets.bottom, 12]);

    return {
      paddingBottom,
    };
  });

  const rInputContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      focusProgress.get(),
      [0, 1],
      [allowedWidth.get() - PEN_ICON_SIZE - GAP, allowedWidth.get()]
    );
    const height = interpolate(
      focusProgress.get(),
      [0, 1],
      [BASIC_INPUT_CONTAINER_HEIGHT, FULL_INPUT_CONTAINER_HEIGHT]
    );
    const borderRadius = interpolate(focusProgress.get(), [0, 1], [40, 26]);
    return {
      width,
      height,
      borderRadius,
      transform: [{ translateY: bounceY.get() }],
    };
  });

  const rPenBtnStyle = useAnimatedStyle(() => {
    const translateX = interpolate(focusProgress.get(), [0, 1], [0, 100]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={rMainContainerStyle} className="px-3 pt-2 mt-auto">
      <View
        className="flex-row items-center"
        style={{ gap: GAP }}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          if (width > allowedWidth.get()) allowedWidth.set(width);
        }}
      >
        <Animated.View
          style={[{ borderCurve: "continuous", padding: PADDING }, rInputContainerStyle]}
          className="overflow-hidden bg-neutral-800 border border-neutral-700/50"
        >
          <View className="flex-row items-center justify-between">
            <TextInput
              placeholder="Ask a follow up..."
              placeholderTextColor="grey"
              className="flex-1 text-neutral-500 text-lg font-medium"
              selectionColor="#ffffff"
              onFocus={() => {
                focusProgress.set(withTiming(1, { duration: ANIMATION_DURATION }));
              }}
              onBlur={() => {
                focusProgress.set(withTiming(0, { duration: ANIMATION_DURATION }));
              }}
            />
          </View>

          <AnimatedPressable
            onPress={simulatePress}
            style={[{ right: PADDING, bottom: PADDING }]}
            className="p-2 absolute rounded-full items-center justify-center bg-neutral-700/90"
          >
            <Mic size={18} color="white" />
          </AnimatedPressable>

          <View className="flex-row items-center gap-3 mt-[24px]">
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
        </Animated.View>

        <AnimatedPressable
          style={[{ width: PEN_ICON_SIZE, height: PEN_ICON_SIZE }, rPenBtnStyle]}
          onPress={simulatePress}
          className="rounded-full items-center justify-center bg-neutral-800 border border-neutral-700/50"
        >
          <PenLine size={20} color="white" />
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};

export default AnimatedInput;
