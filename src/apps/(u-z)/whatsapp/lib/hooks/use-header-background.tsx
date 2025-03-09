import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
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

export const useHeaderBackground = ({ offsetY }: Props) => {
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

  return { contentOffsetY };
};
