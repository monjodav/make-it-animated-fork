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
import { cn } from "@/utils/cn";

type Props = {
  title: string;
  offsetY: SharedValue<number>;
  searchBarHeight?: number;
  className?: string;
};

export const HeaderTitle: FC<Props> = ({ title, offsetY, searchBarHeight = 0, className }) => {
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();

  const headerBaselineY = useSharedValue(0);

  const rHeaderStyle = useAnimatedStyle(() => {
    const scrollDistance = headerBaselineY.value + searchBarHeight - headerHeight;

    return {
      opacity: withTiming(offsetY.value > scrollDistance ? 1 : 0),
    };
  });

  const rBigTitleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(offsetY.value, [0, -150], [1, 1.1], Extrapolation.CLAMP) }],
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props: HeaderTitleProps) => {
        return (
          <Animated.View style={rHeaderStyle}>
            <HeaderTitleComponent {...props}>{title}</HeaderTitleComponent>
          </Animated.View>
        );
      },
    });
  }, [title, navigation, rHeaderStyle]);

  return (
    <Animated.Text
      className={cn("text-white font-bold text-3xl", className)}
      style={[rBigTitleStyle, { transformOrigin: "left" }]}
      onLayout={({ nativeEvent }) =>
        headerBaselineY.set(nativeEvent.layout.y + nativeEvent.layout.height)
      }
    >
      {title}
    </Animated.Text>
  );
};
