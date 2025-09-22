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
  Path,
  processTransform3d,
  Skia,
  usePathValue,
} from "@shopify/react-native-skia";
import { useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect, useState } from "react";

const DURATION = 2500;
const PRIMARY_COLOR = "#039e81ff";
const SECONDARY_COLOR = "#418140ff";

const StartTimerButton = () => {
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
  const leftOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleLeft.value }]));
  }, leftOvalPathBase);

  const rightOvalRect = {
    x: width - 1.2 * ovalWidth,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const rightOvalPathBase = Skia.Path.Make().addOval(rightOvalRect);
  const scaleRight = useSharedValue(1);
  const rightOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleRight.value }]));
  }, rightOvalPathBase);

  useEffect(() => {
    scaleLeft.value = withRepeat(withTiming(1.2, { duration: DURATION }), -1, true);
    scaleRight.value = withDelay(
      DURATION / 1.25,
      withRepeat(withTiming(1.2, { duration: DURATION }), -1, true)
    );
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setWidth(width);
    setHeight(height);
  };

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
            <Path path={leftOvalPath} color={PRIMARY_COLOR}>
              <Blur blur={30} />
            </Path>
            <Path path={rightOvalPath} color={SECONDARY_COLOR}>
              <Blur blur={30} />
            </Path>
          </Canvas>
          <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-1.5 items-center justify-center">
            <Ionicons name="play" size={20} color="white" />
            <Text className="text-white text-xl font-medium">Start Timer</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

export default StartTimerButton;
