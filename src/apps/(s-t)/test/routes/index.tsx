import { View, Text, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

/**
 * Array of 8 different colors for the boxes
 */
const colors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Light Blue
];

// Radius of the circle in pixels
const RADIUS = 150;
// Angle step between each box (full circle divided by number of boxes)
const ANGLE_STEP = (2 * Math.PI) / colors.length;
// Box size (size-16 = 64px)
const BOX_SIZE = 64;

type BoxItemProps = {
  color: string;
  index: number;
  angleProgress: SharedValue<number>;
};

/**
 * Individual box component positioned on the circle
 */
const BoxItem = ({ color, index, angleProgress }: BoxItemProps) => {
  const angle = useDerivedValue(() => {
    return angleProgress.get() + index * ANGLE_STEP - Math.PI / 2;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const currentAngle = angle.get();
    const translateX = RADIUS * Math.cos(currentAngle);
    const translateY = RADIUS * Math.sin(currentAngle);
    // Rotate box so its bottom edge points toward the circle center
    // Add Math.PI/2 to adjust from right edge to bottom edge (90 degrees counterclockwise)
    const rotation = currentAngle + Math.PI / 2;
    return {
      transform: [{ translateX }, { translateY }, { rotate: `${rotation}rad` }],
    };
  });

  return (
    <Animated.View
      className="size-16 rounded-lg items-center justify-center absolute"
      style={[
        {
          backgroundColor: color,
          left: RADIUS - BOX_SIZE / 2,
          top: RADIUS - BOX_SIZE / 2,
        },
        animatedStyle,
      ]}
    >
      <Text className="text-white text-lg font-semibold">{index}</Text>
    </Animated.View>
  );
};

/**
 * Test screen with 8 colored boxes arranged in a circle
 * Each box displays its index number in the center
 * Boxes are positioned on a circular path
 */
export default function Test() {
  const insets = useSafeAreaInsets();

  const angleProgress = useSharedValue(0);

  return (
    <View
      className="flex-1 bg-background items-center justify-center"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          width: RADIUS * 2,
          height: RADIUS * 2,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Circle outline */}
        <View
          style={{
            width: RADIUS * 2,
            height: RADIUS * 2,
            borderRadius: RADIUS,
            borderWidth: 2,
            borderColor: "#E5E5E5",
            position: "absolute",
          }}
        />

        {/* Boxes positioned on the circle */}
        {colors.map((color, index) => {
          return <BoxItem key={index} color={color} index={index} angleProgress={angleProgress} />;
        })}
      </View>
      <View className="absolute bottom-20 left-0 right-0">
        <Button
          title="Rotate"
          onPress={() =>
            angleProgress.set(
              withSpring(angleProgress.get() + ANGLE_STEP, { damping: 70, stiffness: 1200 })
            )
          }
        />
      </View>
    </View>
  );
}
