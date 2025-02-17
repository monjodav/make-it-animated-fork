import {
  HeaderTitle as HeaderTitleComponent,
  HeaderTitleProps,
  useHeaderHeight,
} from "@react-navigation/elements";
import { useNavigation } from "expo-router";
import type React from "react";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  measure,
  type SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  offsetY: SharedValue<number>;
};

export const useHeaderTitle = ({ offsetY }: Props) => {
  const navigation = useNavigation();

  const headerHeight = useHeaderHeight();

  const triggerRef = useAnimatedRef();
  const isTriggerMounted = useSharedValue(false);

  const triggerMeasurement = useDerivedValue(() => {
    if (isTriggerMounted.value === false) {
      return null;
    }

    const measurement = measure(triggerRef);

    if (measurement === null) {
      return null;
    }

    return measurement;
  });

  const rTitleStyle = useAnimatedStyle(() => {
    if (triggerMeasurement.value === null) {
      return { opacity: 0 };
    }

    const triggerHeight = triggerMeasurement.value.height;
    const triggerPageY = triggerMeasurement.value.pageY;

    const scrollDistance = triggerPageY - headerHeight;

    return {
      opacity: 1,
      transform: [
        {
          translateY: interpolate(
            offsetY.value,
            [0, scrollDistance, scrollDistance + triggerHeight],
            [30, 30, 0],
            {
              extrapolateRight: "clamp",
            }
          ),
        },
      ],
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (props: HeaderTitleProps) => {
        return (
          <View className="py-3 overflow-hidden">
            <Animated.View style={rTitleStyle}>
              <HeaderTitleComponent {...props}>vvv-sss</HeaderTitleComponent>
            </Animated.View>
          </View>
        );
      },
    });
  }, [navigation, rTitleStyle]);

  return { triggerRef, isTriggerMounted };
};
