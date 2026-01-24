import { FC } from "react";
import Animated, { SharedValue, useDerivedValue } from "react-native-reanimated";
import { AnimatedDigit } from "./animated-digit";
import { ScaleContainer } from "./scale-container";
import { TranslateContainer } from "./translate-container";

const FONT_SIZE = 56;

type DigitalWheelProps = {
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
};

export const DigitalWheel: FC<DigitalWheelProps> = ({ currentIndex, previousIndex }) => {
  return (
    <Animated.View className="w-[30px] items-center" style={{ height: FONT_SIZE }}>
      {Array.from({ length: 10 }, (_, index) => {
        return (
          <TranslateContainer
            key={index}
            index={index}
            currentIndex={currentIndex}
            previousIndex={previousIndex}
            fontSize={FONT_SIZE}
          >
            <ScaleContainer index={index} currentIndex={currentIndex} previousIndex={previousIndex}>
              <AnimatedDigit
                index={index}
                currentIndex={currentIndex}
                previousIndex={previousIndex}
              />
            </ScaleContainer>
          </TranslateContainer>
        );
      })}
    </Animated.View>
  );
};
