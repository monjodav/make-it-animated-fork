import React from "react";
import { View, FlatList, Pressable, Alert } from "react-native";
import { useHeaderHeight } from "../../lib/hooks/use-header-height";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { FULL_DRAG_DISTANCE, useHomeAnimation } from "../../lib/providers/home-animation";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const CommandItem = () => {
  const randomWidth = React.useMemo(() => Math.floor(Math.random() * 151) + 50, []);

  return (
    <Pressable className="flex-row items-center gap-3" onPress={() => Alert.alert("Item Pressed")}>
      <View className="w-8 h-8 rounded-xl bg-orange-800" />
      <View className="h-3 rounded-full bg-neutral-200/25" style={{ width: randomWidth }} />
    </Pressable>
  );
};

export const CommandsList = () => {
  const insets = useSafeAreaInsets();

  const { grossHeight, netHeight } = useHeaderHeight();

  const { screenView, offsetY } = useHomeAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity:
        screenView === "commands"
          ? 1
          : interpolate(
              offsetY.value,
              [FULL_DRAG_DISTANCE * 0.2, FULL_DRAG_DISTANCE],
              [0, 1],
              Extrapolation.CLAMP
            ),
      transform: [{ translateY: -offsetY.value }],
      pointerEvents: screenView === "commands" ? "auto" : "none",
    };
  });

  return (
    <Animated.View className="absolute w-full h-full" style={rContainerStyle}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <FlatList
          data={Array.from({ length: 30 })}
          renderItem={() => <CommandItem />}
          keyExtractor={(_, index) => index.toString()}
          className="flex-1"
          contentContainerClassName="gap-4 px-5"
          contentContainerStyle={{
            paddingTop: grossHeight + 20,
            paddingBottom: insets.bottom + 8,
          }}
          indicatorStyle="white"
          scrollIndicatorInsets={{ top: netHeight + 16 }}
        />
      </KeyboardAvoidingView>
    </Animated.View>
  );
};
