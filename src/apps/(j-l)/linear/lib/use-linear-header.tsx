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

// linear-header-on-scroll-animation 🔽

// This hook flips the header's placeholder → title with a 3D card-flip
// once the content scroll passes a threshold. Progress is discretized (0 → 1)
// and eased with timing to avoid jank from noisy scroll deltas.

// DEFAULT_SWITCH_OFFSET: Scroll distance (px) after which header swaps placeholder → title.
// Small value (30) produces a quick, responsive hand-off aligned with Linear's snappy feel.
const DEFAULT_SWITCH_OFFSET = 30;

// ROW_HEIGHT: Single-line header text height used to compute vertical slide distance
// during the flip so the two texts pass through the same baseline.
const ROW_HEIGHT = 28;

// DURATION: Flip timing (ms). 320ms balances responsiveness with legibility of the flip.
const DURATION = 320;

// PERSPECTIVE: 3D depth (px). Lower increases distortion; 700 keeps a subtle, realistic tilt.
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
  // progress: shared flip progress (0 = placeholder visible, 1 = title visible)
  // Central coordination point used by both outgoing/incoming animated styles.
  const progress = useSharedValue(0);

  // useDerivedValue: maps raw scroll offset to a discrete target (0 or 1) to avoid
  // micro-flips around the threshold. withTiming smooths the transition with
  // Easing.out(Easing.cubic) for a quick start and gentle settle.
  useDerivedValue(() => {
    const scrollY = offsetY.get() >= switchOffset ? 1 : 0; // threshold gate

    if (progress.get() !== scrollY) {
      progress.set(
        withTiming(scrollY, {
          duration: durationMs,
          easing: Easing.out(Easing.cubic), // fast-out for snappy reveal
        })
      );
    }
  });

  const rOutgoingStyle = useAnimatedStyle(() => {
    const flipProgress = progress.get();

    return {
      // Fade out placeholder as we flip away
      opacity: 1 - flipProgress,
      transform: [
        // perspective: enables realistic 3D rotation without skew artifacts
        { perspective: PERSPECTIVE },
        // rotateX: 0deg → 90deg (fold away upward)
        { rotateX: `${90 * flipProgress}deg` },
        // translateY: 0 → -ROW_HEIGHT to keep the fold aligned to the baseline
        { translateY: -ROW_HEIGHT * flipProgress },
      ],
      // prevents the back face from flashing during 3D rotation on some GPUs
      backfaceVisibility: "hidden",
    };
  });

  const rIncomingStyle = useAnimatedStyle(() => {
    const flipProgress = progress.get();

    return {
      // Fade in title as it flips into view
      opacity: flipProgress,
      transform: [
        { perspective: PERSPECTIVE },
        // rotateX: -90deg → 0deg (unfold downward into place)
        { rotateX: `${-90 * (1 - flipProgress)}deg` },
        // translateY: ROW_HEIGHT → 0 to meet the same baseline as it unfolds
        { translateY: ROW_HEIGHT * (1 - flipProgress) },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const headerLeft = useCallback(
    () => (
      <View
        // overflow-hidden: clips 3D transforms so text doesn't bleed outside header
        className="overflow-hidden"
        style={{
          // Left inset matches design padding; width 1/2 limits layout reflow during flip
          left: 16,
          width: width / 2,
          // Ensures the two texts share identical vertical space/baseline math
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
    // Inject animated headerLeft into current screen and parent stack.
    // Parent headerTitle is cleared to avoid overlap with our custom animated title area.
    navigation.setOptions({
      headerLeft,
    });
    navigation.getParent()?.setOptions({ headerTitle: "", headerLeft });
  }, [navigation, headerLeft]);
};

// linear-header-on-scroll-animation 🔼
