import React, { FC } from "react";
import { Alert, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIndexAnimation } from "@/src/shared/lib/providers/index-animation";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { QrCodeIcon } from "lucide-react-native";
import { useCameraPermissions } from "expo-camera";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PressToScanBtn: FC = () => {
  const [status, requestPermission] = useCameraPermissions();

  const { state } = useIndexAnimation();

  const scale = useSharedValue(1);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(state.value, [0, 1], [1, 0]),
      transform: [{ scale: interpolate(state.value, [0, 1], [1, 2]) }],
    };
  });

  const rPressableStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    if (status?.granted) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      state.set(withTiming(1, { duration: 200 }));
    } else if (!status?.granted && status?.canAskAgain) {
      requestPermission();
    } else if (!status?.granted && !status?.canAskAgain) {
      Alert.alert(
        "Camera permission required",
        "Please grant camera permission to use this feature.",
        [
          {
            text: "Grant Permissions",
            style: "default",
            isPreferred: true,
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: "Dismiss",
            style: "destructive",
          },
        ]
      );
    }
  };

  return (
    <Animated.View style={rContainerStyle}>
      <AnimatedPressable
        onPressIn={() => scale.set(withTiming(0.95, { duration: 100 }))}
        onPressOut={() => scale.set(withTiming(1, { duration: 100 }))}
        onPress={handlePress}
        className="gap-1.5 items-center"
        style={rPressableStyle}
      >
        <Animated.View entering={FadeIn.delay(1000)}>
          <QrCodeIcon size={60} color="#e7e5e4" />
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.delay(1200)}
          className="text-stone-200 font-medium text-sm"
        >
          Press to scan
        </Animated.Text>
      </AnimatedPressable>
    </Animated.View>
  );
};
