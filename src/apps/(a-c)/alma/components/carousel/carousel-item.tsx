import { FC, memo } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
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
  useDerivedValue(() => {
    console.log(">>>>>", Math.round(scrollOffsetX.value / itemWidth));
  }, [scrollOffsetX]);
  const rContainerStyle = useAnimatedStyle(() => {
    // Normalize scroll offset to prevent overflow and enable infinite scrolling
    const normalizedOffset =
      ((scrollOffsetX.value % allItemsWidth) + allItemsWidth) % allItemsWidth;
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

    // ++++++++++++
    // way 1
    // const normalizedScrollX = ((scrollOffsetX.value % allItemsWidth) + allItemsWidth) % allItemsWidth;
    // const slidePosition = index * _itemWidth;
    // let distancePx = Math.abs(slidePosition - normalizedScrollX);
    // if (distancePx > allItemsWidth / 2) {
    //   distancePx = allItemsWidth - distancePx;
    // }
    // const scale = interpolate(distancePx, [0, _itemWidth, _itemWidth * 2], [1, 0.8, 0.7], Extrapolation.CLAMP);
    // ++++++++++++

    // ++++++++++++
    const normalizedScrollX =
      ((scrollOffsetX.value % allItemsWidth) + allItemsWidth) % allItemsWidth;
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
    // ++++++++++++

    return {
      left: x - itemWidth / 2 - 1, // adjust for observed right shift (empirically measured)
      top: y - itemHeight,
      transform: [{ rotateZ: `${rotation + 90}deg` }, { scale }],
    };
  });

  return (
    <Animated.View
      className="absolute rounded-[30px] px-4 mt-20 bg-white items-center justify-center"
      style={[
        rContainerStyle,
        { width: itemWidth, height: itemHeight, transformOrigin: "center bottom" },
        styles.borderCurve,
      ]}
    >
      <Text>{slide.id}</Text>
      <Text className="text-4xl">{slide.emoji}</Text>
      <Text className="text-2xl font-medium text-center">{slide.description}</Text>
    </Animated.View>
  );
};

export const CarouselItem = memo(CarouselItemComponent);

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
