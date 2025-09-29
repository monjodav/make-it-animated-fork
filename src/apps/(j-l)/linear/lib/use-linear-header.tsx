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

const DEFAULT_SWITCH_OFFSET = 30;
const ROW_HEIGHT = 28;
const DURATION = 320;
const PERSPECTIVE = 700;

type Params = {
  offsetY: SharedValue<number>;
  title: string;
  switchOffset?: number;
  placeholderText?: string;
  enableOpacity?: boolean;
  durationMs?: number;
};

export const useLinearHeader = ({
  offsetY,
  title,
  switchOffset = DEFAULT_SWITCH_OFFSET,
  placeholderText = "make it animated",
  enableOpacity = true,
  durationMs = DURATION,
}: Params) => {
  const navigation = useNavigation();
  const progress = useSharedValue(0);

  useDerivedValue(() => {
    const scrollY = offsetY.get() >= switchOffset ? 1 : 0;
    if (progress.get() !== scrollY) {
      progress.set(withTiming(scrollY, { duration: durationMs, easing: Easing.out(Easing.cubic) }));
    }
  });

  const rOutgoingStyle = useAnimatedStyle(() => {
    const flipProgress = progress.get();
    return {
      opacity: enableOpacity ? 1 - flipProgress : 1,
      transform: [
        { perspective: PERSPECTIVE },
        { rotateX: `${90 * flipProgress}deg` },
        { translateY: -ROW_HEIGHT * flipProgress },
      ],
      position: "absolute",
      left: 0,
      top: 0,
      backfaceVisibility: "hidden",
    };
  });

  const rIncomingStyle = useAnimatedStyle(() => {
    const flipProgress = progress.get();
    return {
      opacity: enableOpacity ? flipProgress : 1,
      transform: [
        { perspective: PERSPECTIVE },
        { rotateX: `${-90 * (1 - flipProgress)}deg` },
        { translateY: ROW_HEIGHT * (1 - flipProgress) },
      ],
      position: "absolute",
      left: 0,
      top: 0,
      backfaceVisibility: "hidden",
    };
  });

  useEffect(() => {
    const headerLeft = () => (
      <View
        style={{
          left: 15,
          overflow: "hidden",
          height: ROW_HEIGHT,
          justifyContent: "center",
          width: "80%",
        }}
      >
        <Animated.Text className="text-[#777777] text-lg font-bold" style={rOutgoingStyle}>
          {placeholderText}
        </Animated.Text>
        <Animated.Text className="text-[#777777] text-lg font-bold" style={rIncomingStyle}>
          {title}
        </Animated.Text>
      </View>
    );

    navigation.setOptions({ headerTitle: "", headerLeft });
    navigation.getParent?.()?.setOptions?.({ headerTitle: "", headerLeft });
  }, [navigation, rOutgoingStyle, rIncomingStyle, title, placeholderText]);
};
