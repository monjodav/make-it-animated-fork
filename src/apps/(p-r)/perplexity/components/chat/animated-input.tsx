import { Pressable, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Plus, Search } from "lucide-react-native";
import { MicButton } from "./mic-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// perplexity-chat-input-on-focus-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MIN_INPUT_CONTAINER_HEIGHT = 56;
const MAX_INPUT_CONTAINER_HEIGHT = 2 * MIN_INPUT_CONTAINER_HEIGHT;

const NEW_CHAT_BTN_SIZE = MIN_INPUT_CONTAINER_HEIGHT;

const INPUT_NEW_CHAT_BTN_GAP = 10;

const AnimatedInput = () => {
  const insets = useSafeAreaInsets();

  const focusProgress = useSharedValue(0);
  const maxInputWidth = useSharedValue(0);

  const rRootContainerStyle = useAnimatedStyle(() => {
    const paddingBottom = interpolate(focusProgress.get(), [0, 1], [insets.bottom + 12, 12]);

    return {
      paddingBottom,
    };
  });

  const rInputContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      focusProgress.get(),
      [0, 1],
      [maxInputWidth.get() - NEW_CHAT_BTN_SIZE - INPUT_NEW_CHAT_BTN_GAP, maxInputWidth.get()]
    );
    const height = interpolate(
      focusProgress.get(),
      [0, 1],
      [MIN_INPUT_CONTAINER_HEIGHT, MAX_INPUT_CONTAINER_HEIGHT]
    );

    return {
      width,
      height,
    };
  });

  const rMicButtonContainer = useAnimatedStyle(() => {
    return {
      opacity: focusProgress.get() > 0.5 ? 0 : 1,
      display: focusProgress.get() === 1 ? "none" : "flex",
    };
  });

  const rControlsContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: focusProgress.get() > 0.5 ? 1 : 0,
      pointerEvents: focusProgress.get() > 0.5 ? "auto" : "none",
    };
  });

  const rPenBtnStyle = useAnimatedStyle(() => {
    const translateX = interpolate(focusProgress.get(), [0, 1], [0, 100]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={rRootContainerStyle} className="px-3 pt-2 mt-auto">
      <View
        className="flex-row items-center"
        style={{ gap: INPUT_NEW_CHAT_BTN_GAP }}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          if (maxInputWidth.get() === 0 && width > 0) {
            maxInputWidth.set(width);
          }
        }}
      >
        <Animated.View
          style={[
            { borderCurve: "continuous", borderRadius: MIN_INPUT_CONTAINER_HEIGHT / 2 },
            rInputContainerStyle,
          ]}
          className="overflow-hidden bg-neutral-800 border border-neutral-700/50"
        >
          <View className="flex-row items-center gap-2 pr-3">
            <TextInput
              placeholder="Ask a follow up..."
              placeholderTextColor="grey"
              className="flex-1 pl-5 text-neutral-50 text-lg/5 font-medium"
              style={{ height: MIN_INPUT_CONTAINER_HEIGHT }}
              selectionColor="#ffffff"
              onFocus={() => {
                focusProgress.set(withSpring(1));
              }}
              onBlur={() => {
                focusProgress.set(withSpring(0));
              }}
            />

            <Animated.View style={rMicButtonContainer}>
              <MicButton />
            </Animated.View>
          </View>

          <Animated.View
            className="flex-1 flex-row items-center justify-between px-3"
            style={rControlsContainerStyle}
          >
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
            <MicButton />
          </Animated.View>
        </Animated.View>

        <AnimatedPressable
          className="rounded-full items-center justify-center bg-neutral-800 border border-neutral-700/50"
          style={[{ width: NEW_CHAT_BTN_SIZE, height: NEW_CHAT_BTN_SIZE }, rPenBtnStyle]}
          onPress={simulatePress}
        >
          <MaterialCommunityIcons name="pencil-plus-outline" size={19} color="white" />
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
};

export default AnimatedInput;

// perplexity-chat-input-on-focus-animation 🔼
