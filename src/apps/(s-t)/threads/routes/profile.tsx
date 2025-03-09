import { BlurView } from "expo-blur";
import { View, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useTargetMeasurement } from "@/src/shared/lib/hooks/use-target-measurment";
import { useAndroidNote } from "@/src/shared/lib/hooks/use-android-note";

// threads-profile-picture-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
Animated.addWhitelistedNativeProps({ intensity: true });

const _duration = 250;
const _timingConfig = { duration: _duration, easing: Easing.out(Easing.quad) };

const Avatar = () => (
  <Image
    placeholder={{ blurhash: "LIJu4L-;F|IU00W=tlRj?^t6rX%2" }}
    style={StyleSheet.absoluteFill}
  />
);

export default function Profile() {
  useAndroidNote("Blur effect is an experimental feature on Android and may not work as expected.");

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const _screenCenterX = screenWidth / 2;
  const _screenCenterY = screenHeight / 2;
  const _defaultAvatarSize = 70;
  const _expandedAvatarSize = screenWidth * 0.65;

  const insets = useSafeAreaInsets();

  const listRef = useAnimatedRef<Animated.ScrollView>();
  const listOffsetX = useScrollViewOffset(listRef);

  const { targetRef, onTargetLayout, measurement } = useTargetMeasurement();

  const imageState = useSharedValue<"open" | "close">("close");
  const imageXCoord = useSharedValue(_screenCenterX);
  const imageYCoord = useSharedValue(_screenCenterY);
  const imageSize = useSharedValue(_defaultAvatarSize);
  const imageScale = useSharedValue(1);
  const blurIntensity = useSharedValue(0);
  const closeBtnOpacity = useSharedValue(0);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return {
        measurement: measurement.value,
        listOffsetX: listOffsetX.value,
      };
    },
    ({ measurement, listOffsetX }) => {
      if (measurement === null) return;

      imageXCoord.value = measurement.pageX;
      imageYCoord.value = measurement.pageY - listOffsetX;
    }
  );

  const rImagePlaceholderStyle = useAnimatedStyle(() => {
    return {
      opacity: imageState.value === "open" ? 0 : 1,
    };
  });

  const rImageContainerStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: imageState.value === "open" ? "auto" : "none",
    };
  });

  const rImageStyle = useAnimatedStyle(() => {
    return {
      left: imageXCoord.value,
      top: imageYCoord.value,
      width: imageSize.value,
      height: imageSize.value,
      opacity: imageState.value === "open" ? 1 : 0,
      transform: [{ scale: imageScale.value }],
    };
  });

  const backdropAnimatedProps = useAnimatedProps(() => {
    return {
      intensity: blurIntensity.value,
    };
  });

  const rCloseBtnStyle = useAnimatedStyle(() => {
    return {
      opacity: closeBtnOpacity.value,
    };
  });

  const open = () => {
    "worklet";
    imageState.value = "open";
    blurIntensity.value = withTiming(100, _timingConfig);
    imageSize.value = withTiming(_expandedAvatarSize, _timingConfig);
    imageXCoord.value = withTiming(_screenCenterX - _expandedAvatarSize / 2, _timingConfig);
    imageYCoord.value = withTiming(_screenCenterY - _expandedAvatarSize / 2, _timingConfig);
    closeBtnOpacity.value = withDelay(_duration, withTiming(1));
  };

  const close = () => {
    "worklet";
    const x = measurement.value?.pageX ?? 0;
    const y = measurement.value?.pageY ?? 0;

    imageState.value = withDelay(_duration, withTiming("close", { duration: 0 }));
    blurIntensity.value = withTiming(0, _timingConfig);
    imageSize.value = withTiming(_defaultAvatarSize, _timingConfig);
    imageXCoord.value = withTiming(x, _timingConfig);
    imageYCoord.value = withTiming(y - listOffsetX.value, _timingConfig);
    closeBtnOpacity.value = withTiming(0, { duration: _duration });
  };

  const pan = Gesture.Pan()
    .onStart(() => {
      panStartX.value = imageXCoord.value;
      panStartY.value = imageYCoord.value;
      closeBtnOpacity.value = withTiming(0, { duration: 200 });
    })
    .onChange((event) => {
      if (imageState.value === "close") return;

      imageXCoord.value += event.changeX / 2;
      imageYCoord.value += event.changeY / 2;

      const deltaX = imageXCoord.value - panStartX.value;
      const deltaY = imageYCoord.value - panStartY.value;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const scale = interpolate(distance, [0, screenWidth / 2], [1, 0.9], {
        extrapolateRight: "clamp",
      });

      const blur = interpolate(distance, [0, screenWidth / 2], [100, 0], {
        extrapolateRight: "clamp",
      });

      imageScale.value = scale;
      blurIntensity.value = blur;
    })
    .onFinalize(() => {
      const deltaX = imageXCoord.value - panStartX.value;
      const deltaY = imageYCoord.value - panStartY.value;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      imageScale.value = withTiming(1, _timingConfig);

      if (distance > _expandedAvatarSize / 2) {
        close();
      } else {
        open();
      }
    });

  return (
    <>
      <Animated.ScrollView
        ref={listRef}
        className="bg-black"
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingTop: insets.top + 30 }}
      >
        <View className="flex-row items-end justify-between mb-6">
          <View className="gap-1">
            <View className="w-[80px] h-6 rounded-full bg-neutral-900" />
            <View className="w-[60px] h-4 rounded-full bg-neutral-900" />
          </View>
          {/* Placeholder for measurement of initial image coords */}
          <Animated.View ref={targetRef} onLayout={onTargetLayout}>
            <AnimatedPressable
              className="rounded-full overflow-hidden"
              style={[
                rImagePlaceholderStyle,
                { width: _defaultAvatarSize, height: _defaultAvatarSize },
              ]}
              onPress={open}
            >
              <Avatar />
            </AnimatedPressable>
          </Animated.View>
        </View>
        <View className="flex-row gap-4 mb-6">
          <View className="w-[60px] h-4 rounded-full bg-neutral-900" />
          <View className="w-[80px] h-4 rounded-full bg-neutral-900" />
        </View>
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 h-10 rounded-lg bg-neutral-900" />
          <View className="flex-1 h-10 rounded-lg bg-neutral-900" />
        </View>
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 h-4 rounded-full bg-neutral-900" />
          <View className="flex-1 h-4 rounded-full bg-neutral-900" />
          <View className="flex-1 h-4 rounded-full bg-neutral-900" />
          <View className="flex-1 h-4 rounded-full bg-neutral-900" />
        </View>
        <View className="flex-row justify-between mb-6">
          <View className="w-[120px] h-4 rounded-full bg-neutral-900" />
          <View className="w-[60px] h-4 rounded-full bg-neutral-900" />
        </View>
        <View className="flex-row gap-2 mb-[500px]">
          <View className="flex-1 aspect-square rounded-2xl bg-neutral-900" />
          <View className="flex-1 aspect-square rounded-2xl bg-neutral-900" />
        </View>
      </Animated.ScrollView>
      <GestureDetector gesture={pan}>
        <AnimatedPressable
          style={[StyleSheet.absoluteFill, rImageContainerStyle]}
          onPress={close}
          className="pointer-events-none"
        >
          <AnimatedBlurView
            tint="systemChromeMaterialDark"
            style={StyleSheet.absoluteFill}
            animatedProps={backdropAnimatedProps}
          />
          <Animated.View
            className="absolute left-4 bg-black/50 p-1 rounded-full"
            style={[rCloseBtnStyle, { top: insets.top + 16 }]}
          >
            <X size={22} color="white" />
          </Animated.View>
          <AnimatedPressable
            className="absolute rounded-full overflow-hidden"
            style={[rImageStyle, { transformOrigin: "center" }]}
          >
            <Avatar />
          </AnimatedPressable>
        </AnimatedPressable>
      </GestureDetector>
    </>
  );
}

// threads-profile-picture-animation 🔼
