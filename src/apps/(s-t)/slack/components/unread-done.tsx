import React, { FC } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useUnreadAnimation } from "../lib/provider/unread-animation";

// slack-catch-up-cards-swipe-animation 🔽

const EASING = Easing.out(Easing.ease);

export const UnreadDone: FC = () => {
  const { isDone } = useUnreadAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.get() ? 1 : 0, { easing: EASING }),
      pointerEvents: isDone.get() ? "auto" : "none",
      transform: [{ scale: withTiming(isDone.get() ? 1 : 0.5, { easing: EASING }) }],
    };
  });

  return (
    <Animated.View style={[rContainerStyle, StyleSheet.absoluteFill]} className="z-50 justify-end">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl mb-4">💥</Text>
        <Text className="text-3xl font-bold text-neutral-200">Boom. You're up to</Text>
        <Text className="text-3xl font-bold text-neutral-200">date.</Text>
      </View>
      <Pressable
        className="p-4 bg-emerald-900 rounded-2xl items-center justify-center"
        style={styles.borderCurve}
        onPress={() => Alert.alert("Done", "Press 'Undo' few times and play with it again")}
      >
        <Text className="text-lg font-semibold text-neutral-200">Done</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

// slack-catch-up-cards-swipe-animation 🔼
