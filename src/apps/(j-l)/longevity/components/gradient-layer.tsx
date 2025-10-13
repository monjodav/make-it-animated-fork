import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

type GradientLayerProps = {
  color: string;
  index: number;
  width: number;
  height: number;
  scrollOffsetX: SharedValue<number>;
};

export const GradientLayer: React.FC<GradientLayerProps> = ({
  color,
  index,
  width,
  height,
  scrollOffsetX,
}) => {
  const rLayerStyle = useAnimatedStyle(() => {
    const center = index * width;
    const opacity = interpolate(
      scrollOffsetX.get(),
      [center - width, center, center + width],
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, [width, index]);

  return (
    <Animated.View style={[{ position: "absolute", bottom: 0 }, rLayerStyle]}>
      <Svg height="1000" width="1000">
        <Defs>
          <RadialGradient id={`grad-${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={`${color}ff`} stopOpacity={1} />
            <Stop offset="93%" stopColor={`${color}89`} stopOpacity={0.95} />
            <Stop offset="100%" stopColor={`${color}04`} stopOpacity={0.001} />
          </RadialGradient>
        </Defs>
        <Circle cx={`${width / 2}`} cy={`${2.04 * height}`} r="900" fill={`url(#grad-${index})`} />
      </Svg>
    </Animated.View>
  );
};
