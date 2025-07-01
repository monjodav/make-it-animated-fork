import React, { FC } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useTabsScreenAnimated } from "../../../lib/providers/tabs-screen-animated-provider";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { AddTabButton } from "./add-tab-button";
import { EditButton } from "./edit-button";
import { useTabsStore } from "../../../lib/store/tabs";
import { useFooterHeight } from "../../../lib/hooks/use-footer-height";

// google-chrome-footer-animation 🔽

export const CustomFooter: FC = () => {
  const { height: screenHeight } = useWindowDimensions();

  const { bottomInset, netHeight, scrollViewPaddingBottom } = useFooterHeight();

  const focusedTabName = useTabsStore.use.focusedTabName();

  const { offsetY, contentHeight } = useTabsScreenAnimated();

  const showBlur = useDerivedValue(() => {
    const focusedContentHeight = contentHeight.value[focusedTabName];
    const screenHeightWithoutFooter = screenHeight + scrollViewPaddingBottom;

    return focusedContentHeight - offsetY.value > screenHeightWithoutFooter;
  });

  const rBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showBlur.value ? 1 : 0, { duration: 50 }),
    };
  });

  const rColorBgStyle = useAnimatedStyle(() => {
    if (Platform.OS === "android") {
      return {
        opacity: 1,
      };
    }

    return {
      opacity: showBlur.value ? withDelay(50, withTiming(0)) : 1,
    };
  });

  return (
    <View
      className="absolute bottom-0 left-0 right-0 pt-1.5"
      style={{ paddingBottom: bottomInset + 8 }}
    >
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          className="bg-neutral-950"
          style={[StyleSheet.absoluteFill, rColorBgStyle]}
        />
        {Platform.OS === "ios" && (
          <Animated.View style={[StyleSheet.absoluteFill, rBlurStyle]}>
            <BlurView tint="systemThickMaterialDark" style={StyleSheet.absoluteFill} />
          </Animated.View>
        )}
      </View>
      <View className="px-5 flex-row items-center justify-between" style={{ height: netHeight }}>
        <EditButton />
        <AddTabButton />
        <Pressable onPress={() => Alert.alert("Done")}>
          <Text className="text-lg font-medium text-stone-200">Done</Text>
        </Pressable>
      </View>
    </View>
  );
};

// google-chrome-footer-animation 🔼
