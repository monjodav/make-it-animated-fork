import React, { FC } from "react";
import { Text } from "react-native";
import Animated, { FadeInDown, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useIndexAnimation } from "../../lib/providers/index-animation";
import { ShadowPressable } from "react-native-inner-shadow";
import { useWindowDimensions } from "react-native";

export const ExploreAnimationsBtn: FC = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const { state } = useIndexAnimation();

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: interpolate(state.value, [0, 1], [0, 200]) }],
    };
  });

  return (
    <Animated.View className="absolute" style={[{ bottom: insets.bottom + 24 }, rContainerStyle]}>
      <Animated.View entering={FadeInDown.delay(1400)}>
        <ShadowPressable
          shadowBlur={6}
          duration={150}
          damping={0.8}
          style={{
            width: width * 0.8,
            height: 55,
            backgroundColor: "#FF4A3D",
            borderRadius: 18,
            borderCurve: "continuous",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Text className="text-neutral-50 text-xl font-poppins-semibold">Explore animations</Text>
        </ShadowPressable>
      </Animated.View>
    </Animated.View>
  );
};
