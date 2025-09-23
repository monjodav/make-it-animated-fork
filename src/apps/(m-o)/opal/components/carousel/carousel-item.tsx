import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

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
  screenWidth: number;
  horizontalPadding: number;
}

const CarouselItem = ({
  item,
  index,
  scrollX,
  itemSize,
  screenWidth,
  horizontalPadding,
}: CarouselItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const availableWidth = screenWidth - horizontalPadding * 2;
    const itemsFullyVisible = Math.floor(availableWidth / itemSize);
    const centerOffset = (itemsFullyVisible * itemSize) / 2;

    const itemCenter = index * itemSize + itemSize / 2;
    const scrollCenter = scrollX.value + centerOffset;
    const distanceFromCenter = Math.abs(itemCenter - scrollCenter);

    const fullyVisibleRange = (itemsFullyVisible * itemSize) / 2;
    const partiallyVisibleRange = fullyVisibleRange + itemSize;

    const scale = interpolate(
      distanceFromCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [1, 1, 0.7],
      "clamp"
    );

    const opacity = interpolate(
      distanceFromCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [1, 1, 0.5],
      "clamp"
    );

    const blurIntensity = interpolate(
      distanceFromCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [0, 0, 15],
      "clamp"
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const animatedBlurProps = useAnimatedProps(() => {
    const availableWidth = screenWidth - horizontalPadding * 2;
    const itemsFullyVisible = Math.floor(availableWidth / itemSize);
    const centerOffset = (itemsFullyVisible * itemSize) / 2;

    const itemCenter = index * itemSize + itemSize / 2;
    const scrollCenter = scrollX.value + centerOffset;
    const distanceFromCenter = Math.abs(itemCenter - scrollCenter);

    const fullyVisibleRange = (itemsFullyVisible * itemSize) / 2;
    const partiallyVisibleRange = fullyVisibleRange + itemSize;

    const blurIntensity = interpolate(
      distanceFromCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [0, 0, 20],
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
          width: 150,
          backgroundColor: "grey",
          marginRight: 10,
          borderRadius: 30,
          padding: 10,
          borderWidth: 1.5,
          borderColor: "#2D2B2E",
          alignSelf: "flex-start",
          overflow: "hidden",
        },
        animatedStyle,
      ]}
    >
      <Image
        contentFit="cover"
        className="w-full h-full rounded-2xl"
        placeholder={{ blurhash: item.blurhash }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.0001)", "black"]}
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
        <Text className="text-sm text-[#B0B0B0] font-bold">{item.description}</Text>
        <View className="flex-row justify-center items-center gap-1 rounded-full bg-[#2D2B2E] p-1">
          <Plus size={18} color="white" strokeWidth={3} />
          <Text className="text-md text-[#fff] font-bold">Add </Text>
        </View>
      </View>

      <AnimatedBlurView
        animatedProps={animatedBlurProps}
        style={[StyleSheet.absoluteFill]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

export default CarouselItem;
