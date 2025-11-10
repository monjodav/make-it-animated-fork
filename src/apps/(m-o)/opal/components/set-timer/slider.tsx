import React, { FC } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { RubberContainer } from "./rubber-container";
import { cn } from "@/src/shared/lib/utils/cn";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { scheduleOnRN } from "react-native-worklets";
import { TimerStep } from "../../lib/types";

const SLIDER_WIDTH = Dimensions.get("window").width * 0.73;
const SLIDER_HEIGHT = 40;

type Props = {
  data: TimerStep[];
  value: SharedValue<number>;
};

export const Slider: FC<Props> = ({ data, value }) => {
  const totalSteps = data.length;
  const stepWidth = SLIDER_WIDTH / totalSteps;

  const progress = useSharedValue(stepWidth);
  const startX = useSharedValue(0);
  const lastStepCount = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      const tapX = event.x;

      const tappedStepIndex = Math.ceil(tapX / stepWidth);
      const clampedStepIndex = Math.max(1, Math.min(tappedStepIndex, totalSteps));

      const newProgress = Math.max(0, Math.min(clampedStepIndex * stepWidth, SLIDER_WIDTH));
      progress.set(newProgress);

      const newValue = data[clampedStepIndex - 1].value;
      value.set(newValue);

      startX.set(event.x);
      lastStepCount.set(clampedStepIndex);
    })
    .onChange((event) => {
      const currentX = event.x;

      const currentStepIndex = Math.ceil(currentX / stepWidth);
      const clampedStepIndex = Math.max(1, Math.min(currentStepIndex, totalSteps));

      if (clampedStepIndex !== lastStepCount.get()) {
        lastStepCount.set(clampedStepIndex);

        const newProgress = Math.max(0, Math.min(clampedStepIndex * stepWidth, SLIDER_WIDTH));
        progress.set(newProgress);

        const newValue = data[clampedStepIndex - 1].value;
        value.set(newValue);
      }
    });

  const fireHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  useAnimatedReaction(
    () => progress.get(),
    () => {
      if (Platform.OS === "android") return;
      scheduleOnRN(fireHaptic);
    }
  );

  const rProgressStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(progress.get(), { damping: 140, stiffness: 1600 }),
    };
  });

  return (
    <RubberContainer width={SLIDER_WIDTH} height={SLIDER_HEIGHT} gestures={[gesture]}>
      <View
        style={styles.container}
        className="flex-1 border border-neutral-800 rounded-2xl overflow-hidden py-2.5"
      >
        {Platform.OS === "ios" && (
          <BlurView style={StyleSheet.absoluteFillObject} tint="systemUltraThinMaterialLight" />
        )}
        <View className="flex-1 flex-row">
          {data.map((item, index) => (
            <View
              key={item.value}
              className="items-start justify-center"
              style={{ width: stepWidth }}
            >
              <View
                className={cn(
                  "bg-neutral-700 w-[2px] rounded-full",
                  index === 0 ? "h-full opacity-0" : index % 2 === 0 ? "h-full" : "h-1/2 opacity-70"
                )}
              />
            </View>
          ))}
        </View>
        <Animated.View className="absolute left-0 top-0 bottom-0 bg-white" style={rProgressStyle} />
      </View>
    </RubberContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});
