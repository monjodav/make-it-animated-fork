import React, { FC } from "react";
import { Text } from "react-native";
import Animated, { FadeIn, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Pressable } from "react-native";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useIndexAnimation } from "../../lib/providers/index-animation";

const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

export const ExploreAnimationsBtn: FC = () => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const { state } = useIndexAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: interpolate(state.value, [0, 1], [0, 200]) }],
    };
  });

  return (
    <AnimatedTouchable
      entering={FadeIn}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      className="absolute bottom-0 px-20 py-5 rounded-full items-center self-center bg-stone-300"
      style={[{ bottom: insets.bottom + 24 }, rContainerStyle]}
    >
      <Text className="text-stone-900 text-lg font-semibold">Explore animations</Text>
    </AnimatedTouchable>
  );
};
