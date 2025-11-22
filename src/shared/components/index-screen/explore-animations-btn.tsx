import React, { FC } from "react";
import { Pressable, Text, StyleSheet, View, Platform } from "react-native";
import Animated, { FadeInDown, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIndexAnimation } from "../../lib/providers/index-animation";
import { useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

export const ExploreAnimationsBtn: FC = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const { state } = useIndexAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: interpolate(state.value, [0, 1], [0, 200]) }],
    };
  });

  return (
    <Animated.View className="absolute" style={[{ bottom: insets.bottom + 24 }, rContainerStyle]}>
      <Animated.View entering={FadeInDown.delay(1400)}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/animations");
          }}
          className="h-16 rounded-3xl flex items-center justify-center overflow-hidden"
          style={[
            styles.borderCurve,
            {
              width: width * 0.8,
              backgroundColor: Platform.OS === "ios" ? "#FF8989" : "#FF4A3D",
            },
          ]}
        >
          {Platform.OS === "ios" ? (
            <>
              <View className="absolute h-16 left-1.5 right-1.5 top-2 bg-brand rounded-3xl rounded-tr-2.5xl rounded-tl-2.5xl shadow-[-3_-2_3_#FE4A3D]" />
              <View className="absolute h-16 left-1.5 right-1.5 top-2 bg-brand rounded-3xl rounded-tr-2xl rounded-tl-2xl shadow-[3_-2_3_#FE4A3D]" />
            </>
          ) : null}

          <Text className="text-neutral-50 text-xl font-poppins-semibold">Explore animations</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
