import { useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "expo-router";
import Animated, {
  Easing,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

const TITLE_SWITCH_OFFSET = 30;
const TITLE_ROW_HEIGHT = 28;
const MID = 0.5;
const WIDTH = 0.24;

const clamp = (x: number, min: number, max: number) => {
  "worklet";
  return Math.max(min, Math.min(max, x));
};
const smoothStep = (t: number) => {
  "worklet";
  return t * t * (3 - 2 * t);
};

type Params = {
  offsetY: SharedValue<number>;
  title: string;
  switchOffset?: number;
};

export const useLinearHeader = ({ offsetY, title, switchOffset = TITLE_SWITCH_OFFSET }: Params) => {
  const navigation = useNavigation();
  const progress = useSharedValue(0);

  useDerivedValue(() => {
    const target = offsetY.get() >= switchOffset ? 1 : 0;
    if (progress.get() !== target) {
      progress.set(withTiming(target, { duration: 300, easing: Easing.out(Easing.cubic) }));
    }
  });

  const rOutgoingStyle = useAnimatedStyle(() => {
    const rawProgress = progress.get();
    const rotationDegrees = 90 * rawProgress;
    const translateYShift = -TITLE_ROW_HEIGHT * rawProgress;
    const crossfadeStart = MID - WIDTH * 0.5;
    const crossfadeEnd = MID + WIDTH * 0.5;
    const crossfadeWindowProgress = clamp(
      (rawProgress - crossfadeStart) / (crossfadeEnd - crossfadeStart),
      0,
      1
    );
    const easedCrossfade = smoothStep(crossfadeWindowProgress);
    return {
      opacity: 1 - easedCrossfade,
      transform: [
        { perspective: 700 },
        { rotateX: `${rotationDegrees}deg` },
        { translateY: translateYShift },
      ],
      backfaceVisibility: "hidden" as const,
      position: "absolute" as const,
      left: 0,
      top: 0,
    };
  });

  const rIncomingStyle = useAnimatedStyle(() => {
    const rawProgress = progress.get();
    const rotationDegrees = -90 * (1 - rawProgress);
    const translateYShift = TITLE_ROW_HEIGHT * (1 - rawProgress);
    const crossfadeStart = MID - WIDTH * 0.5;
    const crossfadeEnd = MID + WIDTH * 0.5;
    const crossfadeWindowProgress = clamp(
      (rawProgress - crossfadeStart) / (crossfadeEnd - crossfadeStart),
      0,
      1
    );
    const easedCrossfade = smoothStep(crossfadeWindowProgress);
    return {
      opacity: easedCrossfade,
      transform: [
        { perspective: 700 },
        { rotateX: `${rotationDegrees}deg` },
        { translateY: translateYShift },
      ],
      backfaceVisibility: "hidden" as const,
      position: "absolute" as const,
      left: 0,
      top: 0,
    };
  });

  useEffect(() => {
    const headerLeft = () => (
      <View
        style={{
          left: 15,
          overflow: "hidden",
          height: TITLE_ROW_HEIGHT,
          justifyContent: "center",
          width: "80%",
        }}
      >
        <Animated.Text className="text-[#777777] text-lg font-bold" style={rOutgoingStyle}>
          Title of project
        </Animated.Text>
        <Animated.Text className="text-[#777777] text-lg font-bold" style={rIncomingStyle}>
          {title}
        </Animated.Text>
      </View>
    );

    navigation.setOptions({ headerTitle: "", headerLeft });

    const parent = (navigation as any).getParent?.();
    parent?.setOptions?.({ headerTitle: "", headerLeft });
  }, [navigation, rOutgoingStyle, rIncomingStyle, title]);
};
