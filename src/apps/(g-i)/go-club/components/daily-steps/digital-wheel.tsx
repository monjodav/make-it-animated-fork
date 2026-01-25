import { FC, useState } from "react";
import { Text } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedDigit } from "./animated-digit";
import { ScaleContainer } from "./scale-container";
import { TranslateContainer } from "./translate-container";
import { useDigitalCounter } from "../../lib/digital-counter-context";
import { WheelDirection } from "../../lib/types/daily-steps";

// daily-steps-counter-animation 🔽

// Font size determines digit height and spacing calculations
const FONT_SIZE = 54;
// Bold weight ensures digits are clearly visible during animations
const FONT_WEIGHT = 700;

type DigitalWheelProps = {
  index: number;
  marginRight?: number;
};

export const DigitalWheel: FC<DigitalWheelProps> = ({ index: wheelIndex, marginRight = 0 }) => {
  // Track measured width of each digit (0-9) for consistent layout
  // Different digits have different widths (e.g., '1' vs '8')
  const [digitWidths, setDigitWidths] = useState<number[]>([]);
  const { counter, currentWheelDigits, previousWheelDigits, direction } = useDigitalCounter();

  // Shared values coordinate animation state across components
  // currentIndex: which digit (0-9) is currently displayed in this wheel position
  // previousIndex: which digit was displayed before transition
  // wheelDirection: animation direction (increase/decrease/idle)
  const currentIndex = useSharedValue(0);
  const previousIndex = useSharedValue(0);
  const wheelDirection = useSharedValue<WheelDirection>("increase");

  // Synchronize wheel state with counter changes
  // Updates current/previous indices and direction when digits change
  // Runs on UI thread for smooth animation coordination
  useAnimatedReaction(
    () => currentWheelDigits.get(),
    (currentWheelDigits) => {
      currentIndex.set(currentWheelDigits[wheelIndex]);
      previousIndex.set(previousWheelDigits.get()[wheelIndex]);

      const isDigitsDifferent =
        currentWheelDigits[wheelIndex] !== previousWheelDigits.get()[wheelIndex];
      if (isDigitsDifferent) {
        wheelDirection.set(direction.get());
      } else {
        wheelDirection.set("idle");
      }
    },
  );

  // Container style: uses max digit width to prevent layout shifts
  // Hides wheels that exceed the current counter's digit count
  // Example: counter 5000 (4 digits) hides 5th+ wheel positions
  const rContainerStyle = useAnimatedStyle(() => {
    // Use it if you want dynamic width based on the current digit
    // const currentDigitIndex = currentIndex.get();
    // const width = digitWidths[currentDigitIndex] ?? 0;
    const maxWidth = Math.max(...digitWidths);

    if (wheelIndex + 1 > counter.get().toString().length) {
      return {
        opacity: 0,
        width: 0,
      };
    }
    return {
      opacity: 1,
      width: maxWidth,
    };
  });

  return (
    <>
      {/* LinearTransition.springify() animates layout changes when wheels appear/disappear */}
      {/* translateX offset creates slight overlap between wheels for visual cohesion */}
      <Animated.View
        layout={LinearTransition.springify()}
        className="items-center justify-center"
        style={[
          rContainerStyle,
          { height: FONT_SIZE, marginRight, transform: [{ translateX: -4 * wheelIndex }] },
        ]}
      >
        {/* Render all 10 digits (0-9) stacked absolutely, only current digit visible */}
        {/* TranslateContainer: handles 3D rotation and vertical translation */}
        {/* ScaleContainer: handles scale animation during transitions */}
        {/* AnimatedDigit: renders digit with blur effect during transitions */}
        {Array.from({ length: 10 }, (_, index) => {
          return (
            <TranslateContainer
              key={index}
              index={index}
              currentIndex={currentIndex}
              previousIndex={previousIndex}
              wheelDirection={wheelDirection}
              fontSize={FONT_SIZE}
              digitWidth={digitWidths[index] ?? 0}
            >
              <ScaleContainer
                index={index}
                currentIndex={currentIndex}
                previousIndex={previousIndex}
                wheelDirection={wheelDirection}
              >
                <AnimatedDigit
                  index={index}
                  fontSize={FONT_SIZE}
                  fontWeight={FONT_WEIGHT}
                  digitWidth={digitWidths[index] ?? 0}
                  currentIndex={currentIndex}
                  previousIndex={previousIndex}
                  wheelDirection={wheelDirection}
                />
              </ScaleContainer>
            </TranslateContainer>
          );
        })}
      </Animated.View>
      {/* Hidden measurement layer: measures actual width of each digit */}
      {/* Used to calculate container width and prevent layout shifts */}
      {/* opacity-0 keeps them invisible but still measurable */}
      {Array.from({ length: 10 }, (_, index) => {
        return (
          <Text
            key={index}
            className="absolute opacity-0 text-white"
            style={{
              fontSize: FONT_SIZE,
              fontWeight: FONT_WEIGHT,
            }}
            onTextLayout={({ nativeEvent }) => {
              const width = Math.round(nativeEvent.lines[0].width);
              setDigitWidths((prev) => {
                const updated = [...prev];
                updated[index] = width;
                return updated;
              });
            }}
            pointerEvents="none"
          >
            {index}
          </Text>
        );
      })}
    </>
  );
};

// daily-steps-counter-animation 🔼
