import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedProps,
  Extrapolation,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface CarouselItemProps {
  item: {
    id: number;
    title: string;
    description: string;
    blurhash: string;
  };
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  itemWidth: number;
  itemMargin: number;
  screenWidth: number;
  horizontalPadding: number;
}

const CarouselItem = ({
  item,
  index,
  scrollX,
  itemSize,
  itemWidth,
  itemMargin,
  screenWidth,
  horizontalPadding,
}: CarouselItemProps) => {
  const rItemStyle = useAnimatedStyle(() => {
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;

    const itemLeftEdge = index * itemSize - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;

    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    const fullyVisibleRange = itemWidth;

    const partiallyVisibleRange = itemWidth * 1.5;

    const scale = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [1, 1, 0.88],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const rBlurProps = useAnimatedProps(() => {
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;

    const itemLeftEdge = index * itemSize - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;

    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    const fullyVisibleRange = itemWidth;
    const partiallyVisibleRange = itemWidth * 1.5;

    const blurIntensity = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [0, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      intensity: blurIntensity,
    };
  });

  return (
    <Animated.View
      className="aspect-[2/3] rounded-[30px] p-3 border border-white/40 overflow-hidden self-start"
      style={[
        {
          width: itemWidth,
          marginRight: itemMargin,
        },
        styles.container,
        rItemStyle,
      ]}
    >
      <Image
        contentFit="cover"
        placeholder={{ blurhash: item.blurhash }}
        style={[StyleSheet.absoluteFill, styles.image]}
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.95)", "black", "black"]}
        locations={[0, 0.81, 0.88, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View className="mt-auto">
        <Text className="text-base text-white font-bold mb-1">{item.title}</Text>
        <Text className="text-sm text-[#B0B0B0] font-medium mb-4" numberOfLines={3}>
          {item.description}
        </Text>
        <View className="flex-row justify-center items-center gap-1 rounded-full bg-neutral-800/70 p-1">
          <Plus size={15} color="#d4d4d4" strokeWidth={2.5} />
          <Text className="text-md text-neutral-300 font-semibold">Add </Text>
        </View>
      </View>

      <AnimatedBlurView
        animatedProps={rBlurProps}
        style={[StyleSheet.absoluteFill]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: {
    borderRadius: 30,
  },
});

export default CarouselItem;
