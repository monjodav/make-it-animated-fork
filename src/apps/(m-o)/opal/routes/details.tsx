import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Switcher from "../components/switcher";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlurListItem from "../components/blur-list-item";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  useDerivedValue,
  withTiming,
  Easing,
  scrollTo,
} from "react-native-reanimated";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { BlurView } from "expo-blur";
import { cn } from "@/src/shared/lib/utils/cn";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 8;

const PAGE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const GAP = 2 * HORIZONTAL_PADDING;
const PAGE_STRIDE = PAGE_WIDTH + GAP;

const BOTTOM_SWITCHER_POSITION = 10;

type PageBlockProps = {
  onLayout: (e: LayoutChangeEvent) => void;
  count: number;
  borderClass: string;
  buttonLabel: string;
};

const PageBlock = ({ onLayout, count, borderClass, buttonLabel }: PageBlockProps) => (
  <View
    className="mt-auto"
    style={{ width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2, padding: HORIZONTAL_PADDING }}
    onLayout={onLayout}
  >
    <BlurListItem count={count} borderClass={borderClass} intensity={8} />

    <Pressable onPress={simulatePress} className="bg-white rounded-full py-3 mt-4 items-center">
      <Text className="text-black text-lg font-bold">{buttonLabel}</Text>
    </Pressable>
  </View>
);

export const Details = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const [value, setValue] = useState<"schedule" | "timer">("schedule");

  const page = useSharedValue(0);

  const firstTopY = useSharedValue(0);
  const secondTopY = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  const goToIndex = (index: number) => {
    page.set(withTiming(index, { duration: 350, easing: Easing.out(Easing.cubic) }));
  };

  useEffect(() => {
    const initialIndex = value === "schedule" ? 0 : 1;
    page.set(initialIndex);
  }, []);

  useDerivedValue(() => {
    scrollTo(scrollRef, page.get() * PAGE_STRIDE, 0, false);
  });

  const rSwitcherStyle = useAnimatedStyle(() => {
    const interpolatedTop = interpolate(page.get(), [0, 1], [firstTopY.get(), secondTopY.get()]);

    const desiredTop = interpolatedTop - BOTTOM_SWITCHER_POSITION;

    const bottom = Math.max(0, containerHeight.get() - desiredTop);
    return { bottom };
  });

  return (
    <View className="flex-1">
      <Image
        style={StyleSheet.absoluteFill}
        placeholder={{
          blurhash:
            "h14-@F9a%fM{R.Ipt7e:9aD*?GIVs:xZR+ay_2R*t7xtM|xZRkofaK%1NGxuE2X8RkoL9a%LIVxuRjxtR*R*",
        }}
      />

      <LinearGradient
        colors={["transparent", "rgba(48,43,35,0.95)", "black"]}
        locations={[0.2, 0.55, 0.9]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        className="absolute left-0 right-0"
        style={{ bottom: insets.bottom }}
        onLayout={(e) => {
          containerHeight.set(e.nativeEvent.layout.height);
        }}
      >
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PADDING,
            gap: 2 * HORIZONTAL_PADDING,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEnabled={false}
        >
          <PageBlock
            key="one"
            onLayout={(e: LayoutChangeEvent) => firstTopY.set(e.nativeEvent.layout.y)}
            count={7}
            borderClass="border border-neutral-300/30"
            buttonLabel="Save"
          />

          <PageBlock
            key="two"
            onLayout={(e: LayoutChangeEvent) => secondTopY.set(e.nativeEvent.layout.y)}
            count={4}
            borderClass="border border-neutral-400/30"
            buttonLabel="Start Timer"
          />
        </Animated.ScrollView>

        <Animated.View className="absolute left-0 right-0" style={rSwitcherStyle}>
          <Switcher
            value={value}
            setValue={(v) => {
              setValue(v);
              const index = v === "schedule" ? 0 : 1;
              goToIndex(index);
            }}
          />
        </Animated.View>
      </View>

      <Pressable
        onPress={() => router.back()}
        className={cn(
          "absolute top-[70px] left-4 overflow-hidden border border-neutral-300/30 rounded-full p-1.5 bg-neutral-700/30",
          Platform.OS === "android" ? "bg-neutral-500" : "bg-neutral-500/30"
        )}
      >
        <BlurView intensity={8} tint="dark" style={StyleSheet.absoluteFill} />
        <ChevronDown size={20} color="white" strokeWidth={3} />
      </Pressable>
    </View>
  );
};
