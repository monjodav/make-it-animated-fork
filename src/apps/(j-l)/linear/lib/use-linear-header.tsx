import { useCallback, useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
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
  durationMs?: number;
};

export const useLinearHeader = ({
  offsetY,
  title,
  switchOffset = DEFAULT_SWITCH_OFFSET,
  placeholderText = "make it animated",
  durationMs = DURATION,
}: Params) => {
  const { width } = useWindowDimensions();

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
      opacity: 1 - flipProgress,
      transform: [
        { perspective: PERSPECTIVE },
        { rotateX: `${90 * flipProgress}deg` },
        { translateY: -ROW_HEIGHT * flipProgress },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const rIncomingStyle = useAnimatedStyle(() => {
    const flipProgress = progress.get();

    return {
      opacity: flipProgress,
      transform: [
        { perspective: PERSPECTIVE },
        { rotateX: `${-90 * (1 - flipProgress)}deg` },
        { translateY: ROW_HEIGHT * (1 - flipProgress) },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const headerLeft = useCallback(
    () => (
      <View
        className="overflow-hidden"
        style={{
          left: 16,
          width: width / 2,
          height: ROW_HEIGHT,
        }}
      >
        <Animated.Text
          key="placeholder"
          className="absolute left-0 text-[#777777] text-lg font-bold"
          style={rOutgoingStyle}
        >
          {placeholderText}
        </Animated.Text>
        <Animated.Text
          key="title"
          className="absolute left-0 text-[#777777] text-lg font-bold"
          style={rIncomingStyle}
        >
          {title}
        </Animated.Text>
      </View>
    ),
    [width, rOutgoingStyle, placeholderText, rIncomingStyle, title]
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft,
    });
    navigation.getParent()?.setOptions({ headerTitle: "", headerLeft });
  }, [navigation, headerLeft]);
};
