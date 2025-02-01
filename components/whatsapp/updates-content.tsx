import { useNavigation } from "expo-router";
import React, { FC, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { BlurView } from "expo-blur";

type Props = {
  offsetY: SharedValue<number>;
};

export const UpdatesContent: FC<Props> = ({ offsetY }) => {
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();

  const contentOffsetY = useSharedValue(0);

  const rBgStyle = useAnimatedStyle(() => {
    if (contentOffsetY.value <= 0) return { backgroundColor: "#0a0a0a" };

    const scrollDistance = contentOffsetY.value - headerHeight;

    return {
      backgroundColor: offsetY.value > scrollDistance ? "#0a0a0a80" : "#0a0a0a",
    };
  });

  const rBlurStyle = useAnimatedStyle(() => {
    if (contentOffsetY.value <= 0) return { opacity: 0 };

    const scrollDistance = contentOffsetY.value - headerHeight;

    return {
      opacity: withTiming(offsetY.value > scrollDistance ? 1 : 0, { duration: 150 }),
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerBackground: () => {
        return (
          <Animated.View className="absolute inset-0" style={rBgStyle}>
            <Animated.View className="absolute inset-0" style={rBlurStyle}>
              <BlurView
                intensity={50}
                tint="systemChromeMaterialDark"
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          </Animated.View>
        );
      },
    });
  }, [navigation, rBgStyle, rBlurStyle]);

  return (
    <View
      className="opacity-75"
      onLayout={({ nativeEvent }) => contentOffsetY.set(nativeEvent.layout.y)}
    >
      <View className="h-7 w-[80px] bg-neutral-900 rounded-full mb-6" />
      <View className="flex-row items-center mb-8">
        <View className="h-14 w-14 rounded-full bg-neutral-900 mr-3" />
        <View>
          <View className="h-5 w-24 bg-neutral-900 rounded-full mb-1" />
          <View className="h-4 w-32 bg-neutral-900 rounded-full opacity-60" />
        </View>
        <View className="ml-auto flex-row">
          <View className="h-7 w-7 bg-neutral-900 rounded-full mr-3" />
          <View className="h-7 w-7 bg-neutral-900 rounded-full" />
        </View>
      </View>
      <View className="mb-4">
        <View className="h-7 w-[100px] bg-neutral-900 rounded-full mb-2" />
        <View className="h-4 w-[280px] bg-neutral-900 rounded-full opacity-60 mb-6" />
      </View>

      <View className="h-5 w-[180px] bg-neutral-900 rounded-full mb-4" />

      {Array.from({ length: 10 }).map((item, index) => (
        <View key={index} className="flex-row items-center mb-6">
          <View className="h-12 w-12 rounded-full bg-neutral-900 mr-3" />
          <View>
            <View className="h-5 w-48 bg-neutral-900 rounded-full mb-1" />
            <View className="h-4 w-24 bg-neutral-900 rounded-full opacity-60" />
          </View>
          <View className="ml-auto">
            <View className="h-8 w-20 bg-green-500/5 rounded-full" />
          </View>
        </View>
      ))}
    </View>
  );
};
