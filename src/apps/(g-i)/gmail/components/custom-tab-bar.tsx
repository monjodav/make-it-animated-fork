import React, { FC } from "react";
import { Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useBottomTabBarHeight } from "../lib/hooks/use-bottom-tab-bar-height";
import { Mail, Video } from "lucide-react-native";
import { Tab } from "@/app/(g-i)/gmail/_layout";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useAnimatedScrollList } from "../lib/providers/animated-scroll-list-provider";

const _duration = 200;

export const CustomTabBar: FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { grossHeight } = useBottomTabBarHeight();

  const { listOffsetY, offsetYAnchorOnBeginDrag, scrollDirection } = useAnimatedScrollList();

  const rContainerStyle = useAnimatedStyle(() => {
    if (
      listOffsetY.value >= offsetYAnchorOnBeginDrag.value &&
      scrollDirection.value === "to-bottom"
    ) {
      return {
        bottom: withTiming(-grossHeight, { duration: _duration }),
      };
    }

    return {
      bottom: withTiming(0, { duration: _duration }),
    };
  });

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 bg-neutral-800 flex-row"
      style={[rContainerStyle, { height: grossHeight }]}
    >
      <Pressable
        className="flex-1 items-center pt-4"
        onPress={() => navigation.navigate(Tab.Inbox)}
        android_ripple={{ color: "transparent" }}
      >
        <Mail size={20} color={state.index === 0 ? "darksalmon" : "gray"} />
      </Pressable>
      <Pressable
        className="flex-1 items-center pt-4"
        onPress={() => navigation.navigate(Tab.Meet)}
        android_ripple={{ color: "transparent" }}
      >
        <Video size={20} color={state.index === 1 ? "darksalmon" : "gray"} />
      </Pressable>
    </Animated.View>
  );
};
