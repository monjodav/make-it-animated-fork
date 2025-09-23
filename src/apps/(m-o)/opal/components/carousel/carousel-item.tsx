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

    const itemLeftEdge = index * itemSize - scrollX.value;
    const itemCenter = itemLeftEdge + itemWidth / 2;

    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    const fullyVisibleRange = itemWidth;

    const partiallyVisibleRange = itemWidth * 1.5;

    const scale = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [1, 1, 0.88],
      "clamp"
    );

    return {
      transform: [{ scale }],
    };
  });

  const rBlurProps = useAnimatedProps(() => {
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;

    const itemLeftEdge = index * itemSize - scrollX.value;
    const itemCenter = itemLeftEdge + itemWidth / 2;

    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    const fullyVisibleRange = itemWidth;
    const partiallyVisibleRange = itemWidth * 1.5;

    const blurIntensity = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [0, 0, 15],
      "clamp"
    );

    return {
      intensity: blurIntensity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 220,
          width: itemWidth,
          backgroundColor: "grey",
          marginRight: itemMargin,
          borderRadius: 30,
          padding: 10,
          borderWidth: 1.5,
          borderColor: "#2D2B2E",
          alignSelf: "flex-start",
          overflow: "hidden",
        },
        rItemStyle,
      ]}
    >
      <Image
        contentFit="cover"
        className="w-full h-full rounded-2xl"
        placeholder={{ blurhash: item.blurhash }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["transparent", "black"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
        }}
      />
      <View className="mt-auto">
        <Text className="text-md text-[#fff] font-bold">{item.title}</Text>
        <Text className="text-sm text-[#B0B0B0] font-bold mb-3">{item.description}</Text>
        <View className="flex-row justify-center items-center gap-1 rounded-full bg-[#2D2B2E] p-1">
          <Plus size={18} color="white" strokeWidth={3} />
          <Text className="text-md text-[#fff] font-bold">Add </Text>
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

export default CarouselItem;
