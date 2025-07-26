import { BlurView } from "expo-blur";
import React, { FC } from "react";
import { Text, StyleSheet, View, Platform } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const INITIAL_OPACITY = 0;
const ACTIVE_OPACITY = 1;
const TRANSLATE_DISTANCE = 40;
const ACTIVE_TRANSLATE_DISTANCE = 0;
const INITIAL_SCALE = 0.8;
const ACTIVE_SCALE = 1;
const INITIAL_BLUR_INTENSITY = 40;
const ACTIVE_BLUR_INTENSITY = 0;

const SPRING_CONFIG_ON_ENTER = {
  damping: 24,
  stiffness: 160,
};

const SPRING_CONFIG_ON_EXIT = {
  damping: 24,
  stiffness: 220,
};

type Props = {
  label: string;
  itemIndex: number;
  activeIndex: SharedValue<number>;
  prevIndex: SharedValue<number>;
};

export const FeatureItem: FC<Props> = ({ label, itemIndex, activeIndex, prevIndex }) => {
  const opacity = useSharedValue(INITIAL_OPACITY);
  const translateY = useSharedValue(-TRANSLATE_DISTANCE);
  const scale = useSharedValue(INITIAL_SCALE);
  const blurIntensity = useSharedValue(INITIAL_BLUR_INTENSITY);

  const initEnter = (isAscending: boolean) => {
    "worklet";
    opacity.set(INITIAL_OPACITY);
    translateY.set(isAscending ? -TRANSLATE_DISTANCE : TRANSLATE_DISTANCE);
    scale.set(INITIAL_SCALE);
    blurIntensity.set(INITIAL_BLUR_INTENSITY);
  };

  const onEnter = () => {
    "worklet";
    opacity.set(withSpring(ACTIVE_OPACITY, SPRING_CONFIG_ON_ENTER));
    translateY.set(withSpring(ACTIVE_TRANSLATE_DISTANCE, SPRING_CONFIG_ON_ENTER));
    scale.set(withSpring(ACTIVE_SCALE, SPRING_CONFIG_ON_ENTER));
    blurIntensity.set(withSpring(ACTIVE_BLUR_INTENSITY, SPRING_CONFIG_ON_ENTER));
  };

  const onExit = (isAscending: boolean) => {
    "worklet";
    opacity.set(withSpring(INITIAL_OPACITY, SPRING_CONFIG_ON_EXIT));
    translateY.set(
      withSpring(isAscending ? TRANSLATE_DISTANCE : -TRANSLATE_DISTANCE, SPRING_CONFIG_ON_EXIT)
    );
    scale.set(withSpring(INITIAL_SCALE, SPRING_CONFIG_ON_EXIT));
    blurIntensity.set(withSpring(INITIAL_BLUR_INTENSITY, SPRING_CONFIG_ON_EXIT));
  };

  useAnimatedReaction(
    () => ({
      activeIndex: activeIndex.value,
      prevIndex: prevIndex.value,
    }),
    ({ activeIndex, prevIndex }) => {
      const isAscending = activeIndex > prevIndex;
      const isDescending = activeIndex < prevIndex;

      if (activeIndex === itemIndex) {
        if (isAscending) {
          // Ascending swipe: item appears from top
          // Start from top position with small scale and no opacity
          initEnter(true);
          // Animate to center position with full scale and opacity
          onEnter();
        } else if (isDescending) {
          // Descending swipe: item appears from bottom
          // Start from bottom position with small scale and no opacity
          initEnter(false);
          // Animate to center position with full scale and opacity
          onEnter();
        } else {
          // Initial state or direct selection
          scale.set(ACTIVE_SCALE);
          opacity.set(ACTIVE_OPACITY);
          translateY.set(ACTIVE_TRANSLATE_DISTANCE);
          blurIntensity.set(ACTIVE_BLUR_INTENSITY);
        }
      } else if (prevIndex === itemIndex) {
        // This item is becoming inactive (was previously active)
        if (isAscending) {
          // Ascending swipe: previous item disappears to bottom
          onExit(true);
        } else if (isDescending) {
          // Descending swipe: previous item disappears to top
          onExit(false);
        }
      } else {
        // This item is neither active nor previously active
        // Keep it hidden in a neutral state
        initEnter(true);
      }
    }
  );

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.get(),
      transform: [
        {
          translateY: translateY.get(),
        },
        {
          scale: scale.get(),
        },
      ],
    };
  });

  const backdropAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: blurIntensity.get(),
    };
  });

  return (
    <Animated.View className="absolute p-4" style={rContainerStyle}>
      <View className="px-3 py-2 bg-white rounded-[14px]" style={styles.container}>
        <Text className="text-lg">{label}</Text>
      </View>
      {Platform.OS === "ios" && (
        <AnimatedBlurView
          tint="light"
          animatedProps={backdropAnimatedProps}
          style={StyleSheet.absoluteFill}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
    shadowColor: "#1c1917",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});
