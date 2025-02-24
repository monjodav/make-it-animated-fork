import { useNavigation } from "expo-router";
import type React from "react";
import { useEffect } from "react";
import Animated, { type SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Color from "color";

// github-profile-header-title-animation 🔽

type Props = {
  offsetY: SharedValue<number>;
};

export const useHeaderBackground = ({ offsetY }: Props) => {
  const navigation = useNavigation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: withTiming(offsetY.value > 0 ? 0.5 : 0, {
        duration: 200,
      }),
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View
          className="absolute inset-0 bg-black"
          style={[
            rContainerStyle,
            {
              borderColor: Color("#ffffff").alpha(0.05).string(),
            },
          ]}
        />
      ),
    });
  }, [navigation, rContainerStyle]);
};

// github-profile-header-background-animation 🔼
