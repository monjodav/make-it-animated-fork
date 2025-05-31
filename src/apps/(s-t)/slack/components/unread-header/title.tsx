import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { useUnreadAnimation } from "../../lib/provider/unread-animation";

const DURATION = 200;
const ENTER_TRANSLATE_Y = 6;

export const Title: FC = () => {
  const { currentChannelIndex, prevChannelIndex, isDone } = useUnreadAnimation();

  const numberOfLeftChannels = useDerivedValue(() => {
    return Math.max(currentChannelIndex.get() + 1, 1).toFixed(0);
  });

  const titleScale = useSharedValue(1);
  const titleTransformY = useSharedValue(0);
  const titleOpacity = useSharedValue(1);

  const rTitleContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.get() ? 0 : 1, { duration: DURATION }),
      transform: [{ translateY: withTiming(isDone.get() ? -20 : 0, { duration: DURATION }) }],
    };
  });

  const rReTextStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.get(),
      transform: [{ translateY: titleTransformY.get() }, { scale: titleScale.get() }],
    };
  });

  useAnimatedReaction(
    () => ({
      currentChannelIndexValue: currentChannelIndex.get(),
      prevChannelIndexValue: prevChannelIndex.get(),
    }),
    ({ currentChannelIndexValue, prevChannelIndexValue }) => {
      if (currentChannelIndexValue < prevChannelIndexValue) {
        titleScale.set(
          withSequence(withTiming(0.8, { duration: 0 }), withTiming(1, { duration: DURATION }))
        );
        titleTransformY.set(
          withSequence(
            withTiming(-ENTER_TRANSLATE_Y, { duration: 0 }),
            withTiming(0, { duration: DURATION })
          )
        );
        titleOpacity.set(
          withSequence(withTiming(0.5, { duration: 0 }), withTiming(1, { duration: DURATION }))
        );
      }
      if (currentChannelIndexValue > prevChannelIndexValue) {
        titleScale.set(
          withSequence(withTiming(0.8, { duration: 0 }), withTiming(1, { duration: DURATION }))
        );
        titleTransformY.set(
          withSequence(
            withTiming(ENTER_TRANSLATE_Y, { duration: 0 }),
            withTiming(0, { duration: DURATION })
          )
        );
        titleOpacity.set(
          withSequence(withTiming(0.5, { duration: 0 }), withTiming(1, { duration: DURATION }))
        );
      }
    }
  );

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
      <Animated.View
        className="flex-row items-center gap-1"
        style={rTitleContainerStyle}
        layout={LinearTransition}
      >
        <Animated.View style={rReTextStyle} layout={LinearTransition}>
          <ReText text={numberOfLeftChannels} style={styles.text} />
        </Animated.View>
        <Animated.Text className="text-lg font-bold text-neutral-200" layout={LinearTransition}>
          Left
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
});
