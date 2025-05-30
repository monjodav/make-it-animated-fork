import { ChevronLeft, X } from "lucide-react-native";
import React, { FC } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import Animated, { FadeInUp, useAnimatedStyle, withTiming, ZoomIn } from "react-native-reanimated";

type Props = {
  total: number;
};

export const UnreadHeader: FC<Props> = ({ total }) => {
  const { isDone } = useChannelAnimation();

  const rTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.value ? 0 : 1),
      transform: [{ translateY: withTiming(isDone.value ? -20 : 0) }],
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
      <Animated.View
        className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center"
        style={rTitleStyle}
      >
        <View className="flex-row items-center gap-1">
          <Animated.View
            key={total}
            entering={ZoomIn.withInitialValues({
              transform: [{ scale: 0.85 }],
            })}
          >
            <Animated.Text
              key={total}
              entering={FadeInUp.withInitialValues({
                transform: [{ translateY: -6 }],
              })}
              className="text-lg font-bold text-neutral-200"
            >
              {total === 0 ? 1 : total}
            </Animated.Text>
          </Animated.View>
          <Text className="text-lg font-bold text-neutral-200">Left</Text>
        </View>
      </Animated.View>
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
