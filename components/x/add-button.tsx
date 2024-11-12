import { XTabsContext } from "@/providers/x-tabs-provider";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { usePathname } from "expo-router";
import React, { FC, useContext, useEffect, useRef } from "react";
import { Alert, Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DURATION = 200;

// x-fab-animation
export const AddButton: FC = () => {
  const { tabBarHeight, isAddButtonVisible } = useContext(XTabsContext);

  const pathname = usePathname();
  const isMessagesScreen = useRef(false);

  const addButtonScale = useSharedValue(1);

  const bounceTheButton = () => {
    addButtonScale.value = withSequence(
      withTiming(1.1, { duration: DURATION / 2 }),
      withTiming(1, { duration: DURATION / 2 })
    );
  };

  useEffect(() => {
    if (pathname === "/x/messages" && !isMessagesScreen.current) {
      bounceTheButton();
      isMessagesScreen.current = true;
    } else if (pathname !== "/x/messages" && isMessagesScreen.current) {
      bounceTheButton();
      isMessagesScreen.current = false;
    }
  }, [pathname]);

  const rAddButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isAddButtonVisible ? 1 : 0, {
        duration: DURATION,
        easing: Easing.inOut(Easing.quad),
      }),
      pointerEvents: isAddButtonVisible ? "auto" : "none",
      transform: [
        {
          scale: isAddButtonVisible
            ? withSequence(
                withTiming(1.1, { duration: DURATION / 2 }),
                withTiming(1, { duration: DURATION / 2 })
              )
            : withTiming(0.9, { duration: DURATION / 2 }),
        },
      ],
    };
  });

  const rPlusIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(pathname === "/x/messages" ? 0 : 1),
      transform: [
        {
          rotate: withTiming(pathname === "/x/messages" ? "90deg" : "0deg"),
        },
      ],
    };
  });

  const rAddMailIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(pathname === "/x/messages" ? 1 : 0),
      transform: [
        {
          translateX: 1,
        },
        {
          rotate: withTiming(pathname === "/x/messages" ? "0deg" : "-90deg"),
        },
      ],
    };
  });

  return (
    <Animated.View
      className="absolute right-4"
      style={[rAddButtonStyle, { bottom: tabBarHeight + 12 }]}
    >
      <AnimatedPressable
        className="w-14 h-14 rounded-full bg-[#1D9BF0] items-center justify-center"
        style={{
          transform: [{ scale: addButtonScale }],
        }}
        onPressIn={() => {
          addButtonScale.value = withTiming(0.8, { duration: 200 });
        }}
        onPressOut={() => {
          addButtonScale.value = withTiming(1, { duration: 200 });
        }}
        onPress={() => Alert.alert("🚀 ✨ 🪐")}
      >
        <Animated.View className="absolute" style={rPlusIconStyle}>
          <AntDesign name="plus" size={20} color="#fff" />
        </Animated.View>
        <Animated.View className="absolute" style={rAddMailIconStyle}>
          <MaterialCommunityIcons name="email-plus-outline" size={20} color="#fff" />
        </Animated.View>
      </AnimatedPressable>
    </Animated.View>
  );
};
