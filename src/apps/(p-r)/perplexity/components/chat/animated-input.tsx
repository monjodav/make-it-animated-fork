import { Platform, Pressable, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedReaction,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Plus, Search } from "lucide-react-native";
import { MicButton } from "./mic-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DynamicInput from "../dynamic-input";
import { useRef, useState } from "react";
import { scheduleOnRN } from "react-native-worklets";

// perplexity-chat-input-on-focus-animation 🔽

// Using createAnimatedComponent so Pressable can receive Reanimated styles on the UI thread
// (prevents JS-thread jank during focus transitions). Docs: reanimated -> createAnimatedComponent
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Base geometry unit for the composer. Collapsed height; also used for radii and icon sizing.
const MIN_INPUT_CONTAINER_HEIGHT = 56;
// Expanded height on focus (2x). Big enough to reveal secondary controls without overwhelming the screen.
const MAX_INPUT_CONTAINER_HEIGHT = 2 * MIN_INPUT_CONTAINER_HEIGHT;

// Square button size matches collapsed input for visual rhythm and hit target consistency.
const NEW_CHAT_BTN_SIZE = MIN_INPUT_CONTAINER_HEIGHT;

// Horizontal gap between input and the new-chat button; used in width interpolation math below.
const INPUT_NEW_CHAT_BTN_GAP = 10;

const AnimatedInput = () => {
  const [value, setValue] = useState("");

  const dynamicInputRef = useRef<TextInput>(null);
  const animatedInputRef = useRef<TextInput>(null);

  const insets = useSafeAreaInsets();

  // Single source of truth for focus progress (0 = idle, 1 = focused). Drives all interpolations in sync.
  const focusProgress = useSharedValue(0);
  // Measured max row width (captured once). Enables responsive width interpolation for the input.
  const maxInputWidth = useSharedValue(0);

  // Watch focusProgress and switch focus between inputs
  const focusTextInput = () => {
    dynamicInputRef?.current?.focus();
    animatedInputRef?.current?.blur();
  };

  useAnimatedReaction(
    () => focusProgress.get(),
    (current, previous) => {
      if (current === 1 && previous !== 1) {
        scheduleOnRN(focusTextInput);
      }
    }
  );

  // Animate bottom padding to smoothly remove extra safe-area when focused
  // (avoids layout jump when keyboard sticks the composer).  insets.bottom+12 -> 12
  const rRootContainerStyle = useAnimatedStyle(() => {
    const paddingBottom = interpolate(focusProgress.get(), [0, 1], [insets.bottom + 12, 12]); // collapses extra safe-area padding as the input focuses

    return {
      paddingBottom,
    };
  });

  // Input container grows in both width and height to reveal secondary controls when focused.
  const rInputContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      focusProgress.get(),
      [0, 1],
      [
        // collapsed: leave space for the new-chat button + gap
        maxInputWidth.get() - NEW_CHAT_BTN_SIZE - INPUT_NEW_CHAT_BTN_GAP,
        // focused: take the full available width
        maxInputWidth.get(),
      ]
    );
    const height = interpolate(
      focusProgress.get(),
      [0, 1],
      [MIN_INPUT_CONTAINER_HEIGHT, MAX_INPUT_CONTAINER_HEIGHT] // 56 -> 112 for larger composer
    );

    return {
      width,
      height,
    };
  });

  // Cross-fade and fully hide the inline mic when focused to reduce visual noise.
  // display:none at progress=1 removes layout cost while focused.
  const rMicButtonContainer = useAnimatedStyle(() => {
    return {
      opacity: focusProgress.get() > 0.5 ? 0 : 1,
      display: focusProgress.get() === 1 ? "none" : "flex",
    };
  });

  // Inverse of the inline mic: reveal row of controls only when sufficiently focused.
  // pointerEvents gating prevents accidental taps mid-transition.
  const rControlsContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: focusProgress.get() > 0.5 ? 1 : 0,
      pointerEvents: focusProgress.get() > 0.5 ? "auto" : "none",
    };
  });

  // Slide the pencil button out of the way on focus so it doesn’t compete with the expanded composer.
  const rPenBtnStyle = useAnimatedStyle(() => {
    const translateX = interpolate(focusProgress.get(), [0, 1], [0, 100]);
    return {
      transform: [{ translateX }],
    };
  });

  const rDynamicInputStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(focusProgress.get(), [0, 0.97, 1], [0, 0, 1], Extrapolation.CLAMP),
      pointerEvents: focusProgress.get() > 0.5 ? "auto" : "none",
    };
  });

  return (
    <>
      <Animated.View style={[rRootContainerStyle]} className="mx-3 pt-2 mt-auto">
        <View
          className="flex-row items-center"
          style={{ gap: INPUT_NEW_CHAT_BTN_GAP }}
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width;
            // Capture the available width once to keep interpolations stable and avoid reflows.
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
                ref={animatedInputRef}
                value={value}
                onChangeText={setValue}
                placeholder="Ask a follow up..."
                placeholderTextColor="#737373"
                selectionColor="#ffffff"
                className="flex-1 pl-5 mr-10 text-neutral-50 text-lg/5 font-medium"
                style={{ marginTop: Platform.OS === "android" ? 10 : 18 }}
                numberOfLines={1}
                onFocus={() => {
                  // Spring to 1 for a natural settle-in without abruptness. Default config keeps it snappy.
                  setTimeout(() => {
                    focusProgress.set(withSpring(1));
                  }, 0);
                }}
                onBlur={() => {}}
              />

              <Animated.View className="absolute top-3 right-3" style={rMicButtonContainer}>
                <MicButton />
              </Animated.View>
            </View>

            {/* Secondary controls row (Plus/Search + mic) only visible when focused; opacity + pointerEvents are animated above. */}
            <Animated.View
              className="flex-1 flex-row items-center justify-between px-3 mt-6"
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

          {/* New chat pencil keeps size equal to collapsed input; translates out on focus for visual hierarchy. */}
          <AnimatedPressable
            className="rounded-full items-center justify-center bg-neutral-800 border border-neutral-700/50"
            style={[{ width: NEW_CHAT_BTN_SIZE, height: NEW_CHAT_BTN_SIZE }, rPenBtnStyle]}
            onPress={simulatePress}
          >
            <MaterialCommunityIcons name="pencil-plus-outline" size={19} color="white" />
          </AnimatedPressable>
        </View>
      </Animated.View>

      <Animated.View className="absolute left-0 right-0 bottom-[12px]" style={[rDynamicInputStyle]}>
        <DynamicInput
          ref={dynamicInputRef}
          value={value}
          setValue={setValue}
          focusProgress={focusProgress}
          borderRadius={MIN_INPUT_CONTAINER_HEIGHT / 2}
        />
      </Animated.View>
    </>
  );
};

export default AnimatedInput;

// perplexity-chat-input-on-focus-animation 🔼
