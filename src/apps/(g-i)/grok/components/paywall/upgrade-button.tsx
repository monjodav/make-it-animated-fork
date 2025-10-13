import { ActivityIndicator, LayoutChangeEvent, Pressable, Text, View } from "react-native";
import { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BUTTON_HEIGHT = 56;
const MOCK_LOADING_DURATION = 3000;

const UpgradeButton = () => {
  const [loading, setLoading] = useState(false);

  const wrapperWidth = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  const onWrapperLayout = (e: LayoutChangeEvent) => {
    wrapperWidth.set(e.nativeEvent.layout.width);
  };

  const rButtonStyle = useAnimatedStyle(() => {
    const width = interpolate(progressWidth.get(), [0, 1], [wrapperWidth.get(), BUTTON_HEIGHT]);
    return { width };
  });

  const handlePress = () => {
    if (loading) return;
    setLoading(true);
    progressWidth.set(withSpring(1));
    setTimeout(() => {
      progressWidth.set(withSpring(0));
      setTimeout(() => setLoading(false), 300);
    }, MOCK_LOADING_DURATION);
  };

  return (
    <View onLayout={onWrapperLayout} className="mx-5 mb-5">
      <AnimatedPressable
        onPress={handlePress}
        disabled={loading}
        className="rounded-full bg-white justify-center items-center self-center"
        style={[{ height: BUTTON_HEIGHT }, rButtonStyle]}
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black text-xl font-medium">Upgrade to SuperGrok</Text>
        )}
      </AnimatedPressable>
    </View>
  );
};

export default UpgradeButton;
