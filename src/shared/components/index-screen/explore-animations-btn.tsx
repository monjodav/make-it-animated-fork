import React, { FC } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import Animated, { FadeInDown, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useIndexAnimation } from "../../lib/providers/index-animation";
import { useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";

export const ExploreAnimationsBtn: FC = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

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
            navigation.dispatch(DrawerActions.openDrawer());
          }}
          className="h-16 bg-brand rounded-3xl flex items-center justify-center"
          style={[styles.borderCurve, { width: width * 0.8 }]}
        >
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
