import { View, Pressable, StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScheduleTimerControl from "../components/schedule/schedule-timer-control";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  useDerivedValue,
  scrollTo,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { ScheduleContent } from "../components/schedule/schedule-content";
import { TimerContent } from "../components/schedule/timer-content";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 8;

const PAGE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const GAP = 2 * HORIZONTAL_PADDING;
const PAGE_STRIDE = PAGE_WIDTH + GAP;

const BOTTOM_SWITCHER_POSITION = 5;

export const Schedule = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const [value, setValue] = useState<"schedule" | "timer">("schedule");

  const tabsProgress = useSharedValue(0);

  const firstTabTopY = useSharedValue(0);
  const secondTabTopY = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  const goToIndex = (index: number) => {
    tabsProgress.set(withSpring(index, { duration: 350, dampingRatio: 2 }));
  };

  useEffect(() => {
    const initialIndex = value === "schedule" ? 0 : 1;
    tabsProgress.set(initialIndex);
  }, []);

  useDerivedValue(() => {
    scrollTo(scrollRef, tabsProgress.get() * PAGE_STRIDE, 0, false);
  });

  const rSwitcherStyle = useAnimatedStyle(() => {
    const interpolatedTop = interpolate(
      tabsProgress.get(),
      [0, 1],
      [firstTabTopY.get(), secondTabTopY.get()]
    );
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
            paddingBottom: insets.bottom + 4,
            gap: 2 * HORIZONTAL_PADDING,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEnabled={false}
        >
          <View
            className="mt-auto"
            style={{ width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2, padding: HORIZONTAL_PADDING }}
            onLayout={(e: LayoutChangeEvent) => firstTabTopY.set(e.nativeEvent.layout.y)}
          >
            <ScheduleContent />
          </View>

          <View
            className="mt-auto"
            style={{ width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2, padding: HORIZONTAL_PADDING }}
            onLayout={(e: LayoutChangeEvent) => secondTabTopY.set(e.nativeEvent.layout.y)}
          >
            <TimerContent />
          </View>
        </Animated.ScrollView>

        <Animated.View className="absolute left-0 right-0" style={rSwitcherStyle}>
          <ScheduleTimerControl
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
        onPress={router.back}
        className="absolute left-4 overflow-hidden border border-neutral-700/50 rounded-full p-1.5 bg-neutral-700/30"
        style={{ top: insets.top + 12 }}
      >
        <BlurView intensity={8} tint="systemThinMaterialLight" style={StyleSheet.absoluteFill} />
        <ChevronDown size={20} color="white" />
      </Pressable>
    </View>
  );
};
