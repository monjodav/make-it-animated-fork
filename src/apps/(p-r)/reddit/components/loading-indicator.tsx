import { useEffect, useRef } from "react";
import { usePullToRefresh } from "@/src/shared/components/with-pull-to-refresh";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { interpolatePath, parse } from "react-native-redash";
import LottieView from "lottie-react-native";
import CakeRunner from "@/assets/lottie/cakerun.json";
import { useWindowDimensions, StyleSheet } from "react-native";

const SCALE_VIEW_SIZE = 55;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const PATH_VECTOR_1 = parse(
  "M101.5 51.012C101.5 23.115 78.89.5 51 .5S.5 23.115.5 51.012V115c0 14.012 5.707 26.701 14.919 35.851l-9.46 9.381-.034.034-.026.039c-.758 1.101-1.168 2.248-.868 3.247.314 1.043 1.32 1.682 2.807 1.94l.042.008h43.126c27.89 0 50.494-22.592 50.494-50.488v-64Z"
);
const PATH_VECTOR_2 = parse(
  "M 101.5 115.012 C 101.5 87.115 78.89 64.5 51 64.5 S 0.5 87.115 0.5 115.012 V 116 c 0 14.012 5.707 26.701 14.919 35.851 l -9.46 9.381 l -0.034 0.034 l -0.026 0.039 c -0.758 1.101 -1.168 2.248 -0.868 3.247 c 0.314 1.043 1.32 1.682 2.807 1.94 l 0.042 0.008 h 43.126 c 27.89 0 50.494 -22.592 50.494 -50.488 v -1 Z"
);

const ANIMATED_SVG_HEIGHT = 80;
const ANIMATED_SVG_WIDTH = 70;

const LoadingIndicator = () => {
  const { width: screenWidth } = useWindowDimensions();

  const lottieAnimationRef = useRef<LottieView>(null);

  const { refreshing, hasRefreshed, refreshProgress, displayedRefreshContainerHeight } =
    usePullToRefresh();

  const animatedScale = useSharedValue(1);
  const pathProgress = useSharedValue(0);
  const hasTriggeredPathAnimation = useSharedValue(false);
  const svgScale = useSharedValue(1);

  useEffect(() => {
    if (refreshing) {
      lottieAnimationRef.current?.play();
      svgScale.set(
        withRepeat(
          withSequence(withTiming(1.01, { duration: 200 }), withTiming(0.99, { duration: 200 })),
          -1,
          false
        )
      );
    } else {
      lottieAnimationRef.current?.reset();
      svgScale.set(1);
    }
  }, [refreshing]);

  useDerivedValue(() => {
    // Trigger path animation when refreshProgress reaches 1
    if (refreshProgress.get() >= 1 && !hasTriggeredPathAnimation.get()) {
      hasTriggeredPathAnimation.set(true);
      pathProgress.set(withSpring(1, { stiffness: 1500, damping: 20, mass: 1 }));
      // Start heart pumping animation with sequence
    }

    if (refreshProgress.get() < 0.1) {
      hasTriggeredPathAnimation.set(false);
      pathProgress.set(0);
    }

    if (displayedRefreshContainerHeight.get() < 1) {
      animatedScale.set(1);
    }
  });

  const rOuterContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      refreshProgress.get(),
      [0, 1],
      [-ANIMATED_SVG_HEIGHT, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  const svgAnimatedProps = useAnimatedProps(() => {
    const animatedPathProgress = pathProgress.get();
    const d = interpolatePath(animatedPathProgress, [0, 1], [PATH_VECTOR_1, PATH_VECTOR_2]);
    return {
      d,
    };
  });

  const rSvgScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: svgScale.get() }],
    };
  });

  const rScaleView = useAnimatedStyle(() => {
    // Why: Calculate scale to cover entire screen width as a circle. View is centered, so we need
    // radius to be at least screenWidth / 2. Current radius = SCALE_VIEW_SIZE / 2,
    // target radius = screenWidth / 2. Scale = (screenWidth / 2) / (SCALE_VIEW_SIZE / 2) = screenWidth / SCALE_VIEW_SIZE.
    const scaleValue = (screenWidth * 1.2) / SCALE_VIEW_SIZE;

    return {
      transform: [
        {
          scale: withTiming(hasRefreshed.get() ? scaleValue : 1, {
            duration: 150,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
    };
  });

  return (
    <>
      <Animated.View
        className="items-center"
        style={[rOuterContainerStyle, { transformOrigin: "bottom" }]}
      >
        <Animated.View
          className="absolute top-3 rounded-full bg-[#FF4400]"
          style={[styles.scaleView, rScaleView]}
        />
        <AnimatedSvg
          style={rSvgScaleStyle}
          width={ANIMATED_SVG_WIDTH}
          height={ANIMATED_SVG_HEIGHT}
          viewBox={"0 35 105 45"}
          fill="none"
        >
          <AnimatedPath animatedProps={svgAnimatedProps} fill="#FF4400" />
        </AnimatedSvg>
      </Animated.View>
      <LottieView
        ref={lottieAnimationRef}
        source={CakeRunner}
        speed={1.5}
        loop
        style={{
          position: "absolute",
          top: 12,
          width: 55,
          height: 55,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  scaleView: {
    width: SCALE_VIEW_SIZE,
    height: SCALE_VIEW_SIZE,
  },
});

export default LoadingIndicator;
