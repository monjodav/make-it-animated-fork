import { FC, memo, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  index: number;
  scrollOffsetX: SharedValue<number>;
  allItemsWidth: number;
  activeIndex: number;
  slide: any;
  itemWidth: number;
  itemHeight: number;
  screenWidth: number;
  screenHeight: number;
};

const CarouselItemComponent: FC<Props> = ({
  index,
  scrollOffsetX,
  allItemsWidth,
  activeIndex,
  slide,
  itemWidth,
  itemHeight,
  screenWidth,
  screenHeight,
}) => {
  const rContainerStyle = useAnimatedStyle(() => {
    // Normalize scroll offset to prevent overflow and enable infinite scrolling
    const normalizedOffset =
      ((scrollOffsetX.get() % allItemsWidth) + allItemsWidth) % allItemsWidth;
    // Circular trajectory parameters
    const radius = screenWidth * 0.48 * 1.5;
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const totalItems = allItemsWidth / itemWidth;
    const angleStep = (2 * Math.PI) / totalItems;
    // Calculate the angle so that the active item is always at the center (angle = 0)
    const activeAngle = activeIndex * angleStep;
    const baseAngle = index * angleStep;
    const offsetAngle = (normalizedOffset / allItemsWidth) * 2 * Math.PI;
    // Shift all items so active item is at angle 0 (center)
    const angle = baseAngle - offsetAngle - activeAngle + 11;
    // x, y are the coordinates of the circle
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    // Rotation so the item always points outward from the circle
    const rotation = angle * (180 / Math.PI);

    const normalizedScrollX =
      ((scrollOffsetX.get() % allItemsWidth) + allItemsWidth) % allItemsWidth;
    const slidePosition = index * itemWidth;
    let distancePx = Math.abs(slidePosition - normalizedScrollX);

    if (distancePx > allItemsWidth / 2) {
      distancePx = allItemsWidth - distancePx;
    }
    const scale = interpolate(
      distancePx,
      [0, itemWidth, itemWidth * 2],
      [1, 0.8, 0.7],
      Extrapolation.CLAMP
    );

    return {
      left: x - itemWidth / 2,
      top: y - itemHeight,
      transform: [{ rotateZ: `${rotation + 90}deg` }, { scale }],
    };
  });

  const scaleProgress = useSharedValue(0);

  // set scaleProgress to 1.2 for first slide on initial render if centered
  useEffect(() => {
    if (slide.id === 1 && scrollOffsetX.get() === 0) {
      scaleProgress.set(1.2);
    }
  }, []);

  useAnimatedReaction(
    () => {
      const normalizedScrollX =
        ((scrollOffsetX.get() % allItemsWidth) + allItemsWidth) % allItemsWidth;
      const slidePosition = index * itemWidth;
      let signedDistance = slidePosition - normalizedScrollX;
      if (signedDistance > allItemsWidth / 2) {
        signedDistance -= allItemsWidth;
      } else if (signedDistance < -allItemsWidth / 2) {
        signedDistance += allItemsWidth;
      }
      return signedDistance;
    },
    (curr, _) => {
      if (curr > 160 && curr < 180) {
        scaleProgress.set(withSpring(1.2, { damping: 20, stiffness: 100, mass: 3 }));
      } else if (curr < -10) {
        scaleProgress.set(withTiming(0));
      }
    }
  );

  const rBackgroundStyle = useAnimatedStyle(() => {
    const scale = scaleProgress.get();

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      className="absolute mt-20"
      style={[
        rContainerStyle,
        {
          width: itemWidth,
          height: itemHeight,
          transformOrigin: "center bottom",
        },
      ]}
    >
      <Animated.View
        className="justify-center items-center"
        style={[{ top: itemHeight / 2 }, rBackgroundStyle]}
      >
        {slide.backgroundElement}
      </Animated.View>

      <View
        className="flex-1 rounded-[30px] px-4 bg-white items-center justify-center"
        style={styles.borderCurve}
      >
        <Text className="text-4xl">{slide.emoji}</Text>
        <Text className="text-2xl font-medium text-center">{slide.description}</Text>
      </View>
    </Animated.View>
  );
};

export const CarouselItem = memo(CarouselItemComponent);

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
