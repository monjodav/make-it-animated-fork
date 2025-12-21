import { FC, memo } from "react";
import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { NutrientsItem } from "../../routes/nutrients";

// alma-nutrients-circular-carousel-item-animation 🔽

const ANGLE_STEP = (2 * Math.PI) / 9.5;

const SPRING_CONFIG = {
  damping: 40,
  stiffness: 200,
  mass: 4.5,
};

type Props = {
  index: number;
  slide: NutrientsItem;
  currentIndex: SharedValue<number>;
  animatedIndex: SharedValue<number>;
  radius: number;
};

const CarouselItem: FC<Props> = ({ slide, index, currentIndex, animatedIndex, radius }) => {
  const itemHeight = useSharedValue(0);

  const isCircleAnimationRange = useDerivedValue(() => {
    return currentIndex.get() - 2 <= index && currentIndex.get() + 2 >= index;
  });
  // Calculate the angle for this slide
  const angle = useDerivedValue(() => {
    const baseAngle = -Math.PI / 2;

    return interpolate(
      animatedIndex.get(),
      [index - 2, index - 1, index, index + 1, index + 2],
      [
        baseAngle - ANGLE_STEP * 2,
        baseAngle - ANGLE_STEP,
        baseAngle,
        baseAngle + ANGLE_STEP,
        baseAngle + ANGLE_STEP * 2,
      ],
      Extrapolation.CLAMP
    );
  });

  const translateX = useDerivedValue(() => {
    if (!isCircleAnimationRange.get()) {
      return 0;
    }
    return -radius * Math.cos(angle.get());
  });

  const translateY = useDerivedValue(() => {
    if (!isCircleAnimationRange.get()) {
      return 0;
    }
    return radius * Math.sin(angle.get()) + itemHeight.get() / 2;
  });

  const scale = useDerivedValue(() => {
    return interpolate(
      animatedIndex.get(),
      [index - 1, index, index + 1],
      [0.75, 1, 0.75],
      Extrapolation.CLAMP
    );
  });

  const rotation = useDerivedValue(() => {
    if (!isCircleAnimationRange.get()) {
      return 0;
    }
    return -angle.get() - Math.PI / 2;
  });

  const opacity = useDerivedValue(() => {
    if (!isCircleAnimationRange.get()) {
      return 0;
    }
    return 1;
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.get(),
      transform: [
        { translateX: translateX.get() },
        { translateY: translateY.get() },
        { scale: scale.get() },
        { rotate: `${rotation.get()}rad` },
      ],
    };
  });

  const isCurrent = useDerivedValue(() => {
    return currentIndex.get() === index;
  });

  const rBackgroundElementContainerStyle = useAnimatedStyle(() => {
    const targetValue = isCurrent.get() ? 1 : 0;

    return {
      opacity: withSpring(targetValue, SPRING_CONFIG),
      transform: [{ scale: withSpring(targetValue, SPRING_CONFIG) }],
    };
  });

  return (
    <Animated.View
      className="absolute w-[60%] aspect-[1/0.7]"
      style={[{ borderCurve: "continuous" }, rContainerStyle]}
      onLayout={(event) => {
        itemHeight.set(event.nativeEvent.layout.height);
      }}
    >
      <Animated.View
        className="absolute inset-0 justify-center items-center"
        style={rBackgroundElementContainerStyle}
      >
        {slide.backgroundElement}
      </Animated.View>
      <View className="flex-1 rounded-[36px] px-4 bg-white items-center justify-center shadow-lg shadow-black/5">
        <Text className="text-4xl mb-2">{slide.emoji}</Text>
        <Text className="text-2xl font-medium text-center">{slide.description}</Text>
      </View>
    </Animated.View>
  );
};

CarouselItem.displayName = "CarouselItem";

export default memo(CarouselItem);

// alma-nutrients-circular-carousel-item-animation 🔼
