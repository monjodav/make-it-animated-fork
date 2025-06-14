import React, { FC } from "react";
import { Alert, Platform, Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIndexAnimation } from "@/src/shared/lib/providers/index-animation";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { QrCodeIcon } from "lucide-react-native";
import { useCameraPermissions } from "expo-camera";
import { useAppStore } from "../../lib/store/app";

const STATE_DELAY = 1000; // I need this because there is glitch the camera view is coming from inactive to active state

export const PressToScanBtn: FC = () => {
  const [status, requestPermission] = useCameraPermissions();

  const setIndexView = useAppStore.use.setIndexView();

  const { state } = useIndexAnimation();

  const preOpenProgress = useSharedValue(0);

  useAnimatedReaction(
    () => preOpenProgress.get(),
    (progress) => {
      if (progress === 1) {
        preOpenProgress.set(0);
      }
    }
  );

  const rOuterContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(preOpenProgress.value, [0, 1], [1, 0.8]) }],
    };
  });

  const rInnerContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(state.value, [0, 0.75], [1, 0]),
      transform: [{ scale: interpolate(state.value, [0, 1], [1, 2.5]) }],
    };
  });

  const handlePress = () => {
    if (status?.granted) {
      if (Platform.OS === "android") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }

      setIndexView("qr");

      preOpenProgress.set(withTiming(1, { duration: STATE_DELAY }));

      const timeout = Platform.select({
        ios: STATE_DELAY / 50,
        android: STATE_DELAY,
      });

      const hapticInterval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }, timeout);

      setTimeout(() => {
        clearInterval(hapticInterval);
        state.set(withTiming(1, { duration: 200 }));
      }, STATE_DELAY);
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
    <Animated.View style={rOuterContainerStyle}>
      <Animated.View style={rInnerContainerStyle}>
        <Pressable onPress={handlePress} className="gap-1.5 items-center">
          <Animated.View entering={FadeIn.delay(1000)}>
            <QrCodeIcon size={60} color="#e7e5e4" />
          </Animated.View>
          <Animated.Text
            entering={FadeInDown.delay(1200)}
            className="text-stone-200 font-medium text-sm"
          >
            Press to scan
          </Animated.Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};
