import React, { FC } from "react";
import { Alert } from "react-native";
import { useUnreadAnimation } from "../../lib/provider/unread-animation";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Pressable } from "react-native";
import { ChevronLeft, X } from "lucide-react-native";

// slack-catch-up-cards-swipe-animation 🔽

const DURATION = 50;

export const Left: FC = () => {
  const { isDone } = useUnreadAnimation();

  const rChevronStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.get() ? 0 : 1, { duration: DURATION }),
    };
  });

  const rXStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDone.get() ? 1 : 0, { duration: DURATION }),
    };
  });

  return (
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
  );
};

// slack-catch-up-cards-swipe-animation 🔼
