import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { useHomeAnimation } from "../../lib/providers/home-animation";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const AnimatedBlur = () => {
  const { blurIntensity } = useHomeAnimation();

  const backdropAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: blurIntensity.value,
    };
  });

  return (
    <AnimatedBlurView
      tint="dark"
      style={[StyleSheet.absoluteFill, styles.container]}
      animatedProps={backdropAnimatedProps}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    pointerEvents: "none",
  },
});
