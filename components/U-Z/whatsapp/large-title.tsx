import { useNavigation } from "expo-router";
import React, { FC, useEffect } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  HeaderTitle as HeaderTitleComponent,
  HeaderTitleProps,
  useHeaderHeight,
} from "@react-navigation/elements";
import { cn } from "@/src/shared/lib/utils/cn";

// whatsapp-header-large-title-animation 🔽
// whatsapp-updates-screen-header-animation 🔽

type Props = {
  title: string;
  offsetY: SharedValue<number>;
  searchBarAnimationDistance?: number;
  className?: string;
};

export const LargeTitle: FC<Props> = ({
  title,
  offsetY,
  searchBarAnimationDistance = 0,
  className,
}) => {
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();

  const headerBaselineY = useSharedValue(0);

  const rTitleOpacityStyle = useAnimatedStyle(() => {
    if (headerBaselineY.value <= 0) return { opacity: 0 };

    const scrollDistance = headerBaselineY.value + searchBarAnimationDistance - headerHeight;

    return {
      opacity: withTiming(offsetY.value > scrollDistance ? 1 : 0),
    };
  });

  const rLargeTitleStyle = useAnimatedStyle(() => {
    const scrollDistance = headerBaselineY.value + searchBarAnimationDistance - headerHeight;

    return {
      opacity: offsetY.value < scrollDistance ? 1 : 0,
      transform: [{ scale: interpolate(offsetY.value, [0, -200], [1, 1.1], Extrapolation.CLAMP) }],
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props: HeaderTitleProps) => {
        return (
          <Animated.View style={rTitleOpacityStyle}>
            <HeaderTitleComponent {...props}>{title}</HeaderTitleComponent>
          </Animated.View>
        );
      },
    });
  }, [title, navigation, rTitleOpacityStyle]);

  return (
    <Animated.Text
      className={cn("text-white font-bold text-3xl", className)}
      style={[rLargeTitleStyle, { transformOrigin: "left" }]}
      onLayout={({ nativeEvent }) =>
        headerBaselineY.set(nativeEvent.layout.y + nativeEvent.layout.height)
      }
    >
      {title}
    </Animated.Text>
  );
};

// whatsapp-updates-screen-header-animation 🔼
// whatsapp-header-large-title-animation 🔼
