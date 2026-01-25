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

const FONT_SIZE = 54;
const FONT_WEIGHT = 700;

type DigitalWheelProps = {
  index: number;
  marginRight?: number;
};

export const DigitalWheel: FC<DigitalWheelProps> = ({ index: wheelIndex, marginRight = 0 }) => {
  const [digitWidths, setDigitWidths] = useState<number[]>([]);
  const { counter, currentWheelDigits, previousWheelDigits, direction } = useDigitalCounter();

  const currentIndex = useSharedValue(0);
  const previousIndex = useSharedValue(0);
  const wheelDirection = useSharedValue<WheelDirection>("increase");

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
      <Animated.View
        layout={LinearTransition.springify()}
        className="items-center justify-center"
        style={[
          rContainerStyle,
          { height: FONT_SIZE, marginRight, transform: [{ translateX: -4 * wheelIndex }] },
        ]}
      >
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
