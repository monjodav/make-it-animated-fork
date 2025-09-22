import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  LayoutChangeEvent,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { BlurView } from "expo-blur";
import {
  Blur,
  Canvas,
  Circle,
  Path,
  processTransform3d,
  RadialGradient,
  Skia,
  usePathValue,
  vec,
} from "@shopify/react-native-skia";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

const OVAL_BREATHE_DURATION = 5000;
const OVAL_PRIMARY_COLOR = "#04cea9ff";
const OVAL_SECONDARY_COLOR = "#5c8e5bff";

const SHIMMER_DELAY = 6000;
const SHIMMER_BASE_DURATION = 500;
const SHIMMER_REFERENCE_WIDTH = 200;
const SHIMMER_OVERSHOOT = 1.2;
const SHIMMER_RADIUS = 65;
const SHIMMER_VERTICAL_SHIFT = 20;

const StartTimerButton = () => {
  const shimmerComponentWidth = useSharedValue(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const ovalWidth = height * 3.4;
  const ovalHeight = height * 1.7;
  const centerY = height / 2 + ovalHeight / 2.2;

  const leftOvalRect = {
    x: ovalWidth / 13,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const leftOvalPathBase = Skia.Path.Make().addOval(leftOvalRect);
  const scaleLeft = useSharedValue(1);
  const colorProgressLeft = useSharedValue(0);
  const leftOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleLeft.get() }]));
  }, leftOvalPathBase);

  const rightOvalRect = {
    x: width - 1.2 * ovalWidth,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const rightOvalPathBase = Skia.Path.Make().addOval(rightOvalRect);
  const scaleRight = useSharedValue(1);
  const colorProgressRight = useSharedValue(1);
  const rightOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleRight.get() }]));
  }, rightOvalPathBase);

  useEffect(() => {
    scaleLeft.set(withRepeat(withTiming(1.2, { duration: OVAL_BREATHE_DURATION }), -1, true));
    scaleRight.set(
      withDelay(
        OVAL_BREATHE_DURATION,
        withRepeat(withTiming(1.2, { duration: OVAL_BREATHE_DURATION }), -1, true)
      )
    );

    colorProgressLeft.set(
      withRepeat(
        withSequence(
          withTiming(0, { duration: OVAL_BREATHE_DURATION / 2 }),
          withTiming(1, { duration: OVAL_BREATHE_DURATION / 2 })
        ),
        -1,
        true
      )
    );
    colorProgressRight.set(
      withDelay(
        OVAL_BREATHE_DURATION,
        withRepeat(
          withSequence(
            withTiming(1, { duration: OVAL_BREATHE_DURATION / 2 }),
            withTiming(0, { duration: OVAL_BREATHE_DURATION / 2 })
          ),
          -1,
          true
        )
      )
    );
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setWidth(width);
    setHeight(height);
  };

  const leftOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressLeft.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR]
    );
  });

  const rightOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressRight.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR]
    );
  });

  const rShimmerStyle = useAnimatedStyle(() => {
    if (shimmerComponentWidth.get() === 0) {
      return {
        opacity: 0,
      };
    }

    const duration = SHIMMER_BASE_DURATION * (width / SHIMMER_REFERENCE_WIDTH);

    return {
      opacity: 1,
      transform: [
        {
          translateX: withRepeat(
            withSequence(
              withDelay(
                SHIMMER_DELAY,
                withTiming(-shimmerComponentWidth.get() * SHIMMER_OVERSHOOT, { duration: 0 })
              ),

              withTiming(width * SHIMMER_OVERSHOOT, {
                duration: Math.max(duration, SHIMMER_BASE_DURATION),
                easing: Easing.in(Easing.ease),
              })
            ),
            -1,
            false
          ),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={simulatePress}
      onLayout={handleLayout}
      className="border border-[#333333] h-[55px] rounded-full mx-3 mb-4 overflow-hidden"
    >
      {width > 0 && height > 0 && (
        <>
          {Platform.OS === "ios" && (
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
          )}
          <Canvas
            style={{
              flex: 1,
            }}
          >
            <Path path={leftOvalPath} color={leftOvalColor}>
              <Blur blur={30} />
            </Path>
            <Path path={rightOvalPath} color={rightOvalColor}>
              <Blur blur={30} />
            </Path>
          </Canvas>
          <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-1.5 items-center justify-center">
            <Ionicons name="play" size={20} color="white" />
            <Text className="text-white text-xl font-medium">Start Timer</Text>
          </View>
        </>
      )}

      <Animated.View
        className="absolute"
        style={[
          rShimmerStyle,
          {
            top: -(2 * SHIMMER_RADIUS - 55) / 2 - SHIMMER_VERTICAL_SHIFT,
            left: -SHIMMER_RADIUS,
          },
        ]}
        onLayout={(e) => shimmerComponentWidth.set(e.nativeEvent.layout.width)}
      >
        <Canvas style={{ width: 2 * SHIMMER_RADIUS, height: 2 * SHIMMER_RADIUS }}>
          <Circle cx={SHIMMER_RADIUS} cy={SHIMMER_RADIUS} r={SHIMMER_RADIUS}>
            <Blur blur={30} />
            <RadialGradient
              c={vec(SHIMMER_RADIUS, SHIMMER_RADIUS)}
              r={SHIMMER_RADIUS}
              colors={[
                "rgba(255, 255, 255, 0.3)",
                "rgba(255, 255, 255, 0.2)",
                "rgba(255, 255, 255, 0.1)",
                "rgba(255, 255, 255, 0)",
              ]}
            />
          </Circle>
        </Canvas>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default StartTimerButton;
