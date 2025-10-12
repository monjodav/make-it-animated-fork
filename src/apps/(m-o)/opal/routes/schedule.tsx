import { View, Pressable, StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScheduleTimerControl from "../components/schedule/schedule-timer-control";
import { useState } from "react";
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

// opal-schedule-timer-transition-animation 🔽

const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 8;

const PAGE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
const GAP = 2 * HORIZONTAL_PADDING;
const PAGE_STRIDE = PAGE_WIDTH + GAP;

const BOTTOM_SWITCHER_POSITION = 5;

export const Schedule = () => {
  const [visibleContent, setVisibleContent] = useState<"schedule" | "timer">("schedule");

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const containerHeight = useSharedValue(0);
  const scheduleContentTopY = useSharedValue(0);
  const timerContentTopY = useSharedValue(0);

  const progress = useSharedValue(0);

  const setProgress = (index: number) => {
    progress.set(withSpring(index, { duration: 350, dampingRatio: 2 }));
  };

  useDerivedValue(() => {
    scrollTo(scrollRef, progress.get() * PAGE_STRIDE, 0, false);
  });

  const rSegmentedControlStyle = useAnimatedStyle(() => {
    const interpolatedTop = interpolate(
      progress.get(),
      [0, 1],
      [scheduleContentTopY.get(), timerContentTopY.get()]
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
            onLayout={(e: LayoutChangeEvent) => scheduleContentTopY.set(e.nativeEvent.layout.y)}
          >
            <ScheduleContent />
          </View>

          <View
            className="mt-auto"
            style={{ width: SCREEN_WIDTH - HORIZONTAL_PADDING * 2, padding: HORIZONTAL_PADDING }}
            onLayout={(e: LayoutChangeEvent) => timerContentTopY.set(e.nativeEvent.layout.y)}
          >
            <TimerContent />
          </View>
        </Animated.ScrollView>

        <Animated.View className="absolute left-0 right-0" style={rSegmentedControlStyle}>
          <ScheduleTimerControl
            value={visibleContent}
            setValue={(v) => {
              setVisibleContent(v);
              const index = v === "schedule" ? 0 : 1;
              setProgress(index);
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

// opal-schedule-timer-transition-animation 🔼
