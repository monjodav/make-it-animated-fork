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
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { AddTabButton } from "./add-tab-button";
import { EditButton } from "./edit-button";
import { useTabsStore } from "../../../lib/store/tabs";
import { useFooterHeight } from "../../../lib/hooks/use-footer-height";

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
        backgroundColor: "#0a0a0a",
      };
    }

    return {
      backgroundColor: withTiming(showBlur.value ? "transparent" : "#0a0a0a", { duration: 50 }),
    };
  });

  return (
    <View
      className="absolute bottom-0 left-0 right-0 pt-1.5"
      style={{ paddingBottom: bottomInset }}
    >
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, rColorBgStyle]} />
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
