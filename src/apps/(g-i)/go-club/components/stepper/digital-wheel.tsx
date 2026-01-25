import { FC } from "react";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedDigit } from "./animated-digit";
import { ScaleContainer } from "./scale-container";
import { TranslateContainer } from "./translate-container";
import { useDigitalCounter } from "../../lib/digital-counter-context";
import { WheelDirection } from "../../lib/types";

const FONT_SIZE = 56;

type DigitalWheelProps = {
  index: number;
};

export const DigitalWheel: FC<DigitalWheelProps> = ({ index: wheelIndex }) => {
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
    if (wheelIndex + 1 > counter.get().toString().length) {
      return {
        opacity: 0,
      };
    }
    return {
      opacity: 1,
    };
  });

  return (
    <Animated.View
      className="w-[30px] items-center"
      style={[rContainerStyle, { height: FONT_SIZE }]}
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
          >
            <ScaleContainer
              index={index}
              currentIndex={currentIndex}
              previousIndex={previousIndex}
              wheelDirection={wheelDirection}
            >
              <AnimatedDigit
                index={index}
                currentIndex={currentIndex}
                previousIndex={previousIndex}
                wheelDirection={wheelDirection}
              />
            </ScaleContainer>
          </TranslateContainer>
        );
      })}
    </Animated.View>
  );
};
