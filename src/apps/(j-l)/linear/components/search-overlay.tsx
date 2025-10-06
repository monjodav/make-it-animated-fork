import { useRef } from "react";
import {
  SectionList,
  Pressable,
  StyleSheet,
  View,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useSearch } from "../lib/providers/search-provider";
import Animated, { useAnimatedProps, useAnimatedScrollHandler } from "react-native-reanimated";
import {
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";
import { Search, X } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useScrollDirection } from "@/src/shared/lib/hooks/use-scroll-direction";
import { useHapticOnScroll } from "@/src/shared/lib/hooks/use-haptic-on-scroll";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";

const createMockData = (length: number): number[] => Array.from({ length });
const _sections = [
  {
    key: "s1",
    data: createMockData(4),
  },
  {
    key: "s2",
    data: createMockData(2),
  },
  {
    key: "s3",
    data: createMockData(10),
  },
];

const _renderSectionHeader = () => (
  <View className="h-4 w-[150] mx-5 rounded-full bg-linear-front" />
);

const _renderListItem = () => (
  <View className="flex-row px-5 py-3 items-center gap-4">
    <View className="h-8 w-8 rounded-full bg-linear-front" />
    <View className="h-4 w-[150] mt-2 rounded-full bg-linear-front" />
  </View>
);

const BAR_WIDTH = 24;
const LINE_THICKNESS = 5;
const MORPH_DISTANCE = 60;

const SECTION_HEADER_HEIGHT = 16;
const SECTION_HEADER_MARGIN_TOP = 24;
const ITEM_HEIGHT = 50;

const CHEVRON_ANGLE_DEG = 38;
const CHEVRON_ANGLE_RAD = (CHEVRON_ANGLE_DEG * Math.PI) / 180;

const CHEVRON_RISE = Math.tan(CHEVRON_ANGLE_RAD) * BAR_WIDTH;

const TRIGGER_THRESHOLD = 100;

const INPUT_BAR_ABOVE_KEYBOARD = 5;

export const SearchOverlay = () => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const translateYDistance = height * 0.07;

  const { searchProgress, closeSearch } = useSearch();

  const { onScroll: scrollDirectionOnScroll, scrollDirection } =
    useScrollDirection("include-negative");

  const isListDragging = useSharedValue(false);

  const { singleHapticOnScroll } = useHapticOnScroll({
    isListDragging,
    scrollDirection,

    triggerOffset: -TRIGGER_THRESHOLD,
  });

  const inputRef = useRef<TextInput>(null);

  const { height: kbHeight, progress: kbProgress } = useReanimatedKeyboardAnimation();
  const kbTargetHeight = useSharedValue(0);
  const prevKbH = useSharedValue(0);
  const inputBarH = useSharedValue(56);
  const prevProgress = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const overscrollExceeded = useSharedValue(false);

  const AnimatedSectionList = Animated.createAnimatedComponent(
    SectionList as any
  ) as unknown as typeof SectionList;

  const focus = () => inputRef.current?.focus();
  const blur = () => inputRef.current?.blur();

  useDerivedValue(() => {
    const rawKbProgress = kbProgress.get();
    const rawKbHeight = Math.max(-kbHeight.get(), 0);
    if (rawKbProgress === 0) {
      kbTargetHeight.set(0);
    } else if (rawKbHeight > kbTargetHeight.get()) {
      kbTargetHeight.set(rawKbHeight);
    }
    prevKbH.set(rawKbHeight);
  });

  const appearProgress = useDerivedValue(() => {
    const rawSearchProgress = searchProgress.get();
    return 1 - (1 - rawSearchProgress) * (1 - rawSearchProgress);
  });

  useDerivedValue(() => {
    const prev = prevProgress.get();
    const curr = searchProgress.get();

    if (prev < 0.5 && curr >= 0.5) runOnJS(focus)();

    if (prev > 0.05 && curr <= 0.05) runOnJS(blur)();

    if (curr === 0 && overscrollExceeded.get()) {
      overscrollExceeded.set(false);
    }
    prevProgress.set(curr);
  });

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      overscrollExceeded.set(false);
      isListDragging.set(true);
    },
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      scrollY.set(offsetY);
      overscrollExceeded.set(offsetY <= -TRIGGER_THRESHOLD);

      scrollDirectionOnScroll(event);
      singleHapticOnScroll(event);
    },
    onEndDrag: () => {
      isListDragging.set(false);
      if (overscrollExceeded.get()) {
        overscrollExceeded.set(false);
        runOnJS(blur)();
        runOnJS(closeSearch)();
      }
    },
  });

  const rChevronContainerStyle = useAnimatedStyle(() => {
    const rawScrollY = scrollY.get();
    const overscrollShift = rawScrollY < 0 ? rawScrollY / 2 : 0;

    const secondItemY = SECTION_HEADER_HEIGHT + SECTION_HEADER_MARGIN_TOP + ITEM_HEIGHT;
    const entranceOffset = (1 - appearProgress.get()) * secondItemY;

    const translateY = overscrollShift + entranceOffset;
    return { transform: [{ translateY }] };
  });

  const overscrollMorph = useDerivedValue(() => {
    const overscroll = Math.max(-scrollY.get(), 0);
    return Math.min(overscroll / MORPH_DISTANCE, 1);
  });

  const morphProgress = useDerivedValue(() => {
    const entranceMorph = 1 - appearProgress.get();
    const blended = Math.max(overscrollMorph.get(), 0);

    const p = Math.max(blended, entranceMorph);
    return Math.min(Math.max(p, 0), 1);
  });

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  const rChevronMetrics = useDerivedValue(() => {
    const progress = morphProgress.get();
    const progressAdj = Math.pow(progress, 0.85);
    const midDrop = CHEVRON_RISE * progressAdj;
    const strokeW = LINE_THICKNESS;
    return { midDrop, strokeW };
  });

  const animatedPathProps = useAnimatedProps(() => {
    const { midDrop, strokeW } = rChevronMetrics.get();
    const vOffset = strokeW / 2;
    const hInset = strokeW / 2;
    const left = hInset;
    const right = 2 * BAR_WIDTH - hInset;
    const midX = BAR_WIDTH;
    const midY = (midDrop + vOffset).toFixed(3);
    return {
      d: `M${left} ${vOffset} L ${midX} ${midY} L ${right} ${vOffset}`,
      strokeWidth: strokeW,
    };
  });

  const rChevronStyle = useAnimatedStyle(() => {
    const { midDrop } = rChevronMetrics.get();
    const translateY = -(midDrop / 2);
    return { transform: [{ translateY }] };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    const rawSearchProgress = searchProgress.get();
    const easedValue = 1 - (1 - rawSearchProgress) * (1 - rawSearchProgress);
    const translateY = translateYDistance * (1 - easedValue);
    const scale = 0.96 + 0.04 * easedValue;
    const opacity = easedValue;

    return {
      transform: [{ translateY }, { scale }],
      opacity,
      pointerEvents: rawSearchProgress === 1 ? "auto" : "none",
    };
  });

  const rInputBarStyle = useAnimatedStyle(() => {
    const keyboardVisibleHeight = Math.max(-kbHeight.get(), 0);
    const underOffset = inputBarH.get() + 12;
    let translateY = underOffset;

    if (keyboardVisibleHeight > 0) {
      const isHiding = keyboardVisibleHeight < prevKbH.get() - 0.5;
      if (isHiding) {
        if (keyboardVisibleHeight > 50) {
          translateY = -keyboardVisibleHeight - INPUT_BAR_ABOVE_KEYBOARD;
        } else {
          const tHide = 1 - keyboardVisibleHeight / 50;
          const start = -keyboardVisibleHeight - INPUT_BAR_ABOVE_KEYBOARD;
          const end = underOffset;
          translateY = start * (1 - tHide) + end * tHide;
        }
      } else {
        const target = Math.max(kbTargetHeight.get(), keyboardVisibleHeight);
        const remaining = Math.max(target - keyboardVisibleHeight, 0);
        if (remaining > 50) {
          translateY = underOffset;
        } else {
          const tShow = 1 - remaining / 50;
          const behindPos = Math.min(-keyboardVisibleHeight + INPUT_BAR_ABOVE_KEYBOARD, 0);
          const finalPos = -keyboardVisibleHeight - INPUT_BAR_ABOVE_KEYBOARD;
          translateY = behindPos + (finalPos - behindPos) * tShow;
        }
      }
    }
    return {
      transform: [{ translateY }],
      opacity: 1,
      pointerEvents: "auto",
    };
  });

  return (
    <View style={[{ marginTop: insets.top }, StyleSheet.absoluteFill]}>
      <Animated.View style={rContainerStyle}>
        <AnimatedSectionList
          sections={_sections}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={_renderListItem}
          renderSectionHeader={_renderSectionHeader}
          ListHeaderComponent={() => (
            <Animated.View
              style={rChevronContainerStyle}
              className="self-center items-center justify-center pt-3 pb-1"
            >
              <Animated.View style={rChevronStyle}>
                <Svg
                  width={BAR_WIDTH * 2}
                  height={CHEVRON_RISE + LINE_THICKNESS * 2}
                  viewBox={`0 0 ${BAR_WIDTH * 2} ${CHEVRON_RISE + LINE_THICKNESS * 2}`}
                  fill="none"
                >
                  <AnimatedPath
                    animatedProps={animatedPathProps}
                    stroke="#484848"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Animated.View>
            </Animated.View>
          )}
          SectionSeparatorComponent={() => <View className="h-6" />}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          stickySectionHeadersEnabled={false}
        />
      </Animated.View>

      <Animated.View
        className="absolute left-0 right-0 bottom-0 z-10 flex-row items-center p-2 pb-5 gap-2"
        style={[rInputBarStyle]}
      >
        <LinearGradient
          colors={["transparent", "#0A090C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.2 }}
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row flex-1 items-center bg-[#282828] p-3 rounded-xl gap-2">
          <Search size={20} color="#c3c3c3" />
          <TextInput
            ref={inputRef}
            placeholder="Quick find"
            placeholderTextColor="#888"
            returnKeyType="search"
            className="flex-1 text-white"
            onSubmitEditing={closeSearch}
          />
        </View>

        <Pressable
          className="bg-[#282828] p-3 rounded-xl"
          onPress={() => {
            inputRef.current?.blur();
            closeSearch();
          }}
        >
          <X size={20} color="#c3c3c3" />
        </Pressable>
      </Animated.View>
    </View>
  );
};
