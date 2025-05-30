import { ChevronLeft, X } from "lucide-react-native";
import React, { FC } from "react";
import { View, Pressable, Alert, StyleSheet } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useUnreadAnimation } from "../lib/provider/unread-animation";
import { ReText } from "react-native-redash";

const DURATION = 200;

export const UnreadHeader: FC = () => {
  const { currentChannelIndex, prevChannelIndex, isDragging, isDone } = useUnreadAnimation();

  const rTitleContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.value ? 0 : 1, { duration: DURATION }),
      transform: [{ translateY: withTiming(isDone.value ? -20 : 0, { duration: DURATION }) }],
    };
  });

  const numberOfLeftChannels = useDerivedValue(() => {
    return Math.max(prevChannelIndex.value + 1, 1).toFixed(0);
  });

  const titleScale = useSharedValue(1);
  const titleTransformY = useSharedValue(0);
  const titleOpacity = useSharedValue(1);

  useAnimatedReaction(
    () => ({
      prevChannelIndexValue: prevChannelIndex.value,
      isDraggingValue: isDragging.value,
    }),
    ({ prevChannelIndexValue, isDraggingValue }) => {
      if (isDraggingValue) {
        return;
      }
      if (prevChannelIndexValue - currentChannelIndex.get() === 1) {
        titleScale.set(
          withSequence(withTiming(0.8, { duration: 0 }), withTiming(1, { duration: DURATION }))
        );
        titleTransformY.set(
          withSequence(withTiming(-6, { duration: 0 }), withTiming(0, { duration: DURATION }))
        );
        titleOpacity.set(
          withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: DURATION }))
        );
      }
    }
  );

  const rTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTransformY.value }, { scale: titleScale.value }],
    };
  });

  const rChevronStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.value ? 0 : 1, { duration: 50 }),
    };
  });

  const rXStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.value ? 1 : 0, { duration: 50 }),
    };
  });

  return (
    <View className="flex-row items-center justify-between px-2 mb-3">
      <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
        <Animated.View
          className="flex-row items-center gap-1"
          style={rTitleContainerStyle}
          layout={LinearTransition}
        >
          <Animated.View style={rTitleStyle} layout={LinearTransition}>
            <ReText text={numberOfLeftChannels} style={styles.text} />
          </Animated.View>
          <Animated.Text className="text-lg font-bold text-neutral-200" layout={LinearTransition}>
            Left
          </Animated.Text>
        </Animated.View>
      </View>
      <Pressable
        className="w-8 h-8 items-center justify-center"
        onPress={() => Alert.alert("Go To Home")}
      >
        <Animated.View style={rChevronStyle} className="absolute">
          <ChevronLeft size={28} color="#e5e5e5" strokeWidth={1.5} />
        </Animated.View>
        <Animated.View style={rXStyle} className="absolute">
          <X size={24} color="#e5e5e5" strokeWidth={1.5} />
        </Animated.View>
      </Pressable>
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
