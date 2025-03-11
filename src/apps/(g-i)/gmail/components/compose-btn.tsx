import React, { FC } from "react";
import { TouchableOpacity } from "react-native";
import { Pencil } from "lucide-react-native";
import { useAnimatedScrollList } from "../lib/providers/animated-scroll-list-provider";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useBottomTabBarHeight } from "../lib/hooks/use-bottom-tab-bar-height";

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

const _btnWidth = 125;
const _btnHeight = 50;

const _duration = 200;

export const ComposeBtn: FC = () => {
  const { netHeight, grossHeight } = useBottomTabBarHeight();

  const { listOffsetY, offsetYAnchorOnBeginDrag, scrollDirection } = useAnimatedScrollList();

  const rContainerStyle = useAnimatedStyle(() => {
    if (
      listOffsetY.value >= offsetYAnchorOnBeginDrag.value &&
      scrollDirection.value === "to-bottom"
    ) {
      return {
        width: withTiming(_btnHeight, { duration: _duration }),
        height: withTiming(_btnHeight, { duration: _duration }),
        transform: [{ translateY: withTiming(netHeight, { duration: _duration }) }],
      };
    }

    return {
      width: withTiming(_btnWidth, { duration: _duration }),
      height: withTiming(_btnHeight, { duration: _duration }),
      transform: [{ translateY: withTiming(0, { duration: _duration }) }],
    };
  });

  const rTextOpacityStyle = useAnimatedStyle(() => {
    if (
      listOffsetY.value >= offsetYAnchorOnBeginDrag.value &&
      scrollDirection.value === "to-bottom"
    ) {
      return { opacity: withTiming(0, { duration: _duration / 2 }) };
    }

    return { opacity: withTiming(1, { duration: _duration }) };
  });

  return (
    <AnimatedPressable
      activeOpacity={0.85}
      className="absolute right-6 flex-row gap-3 bg-neutral-800 rounded-full overflow-hidden items-center px-4 shadow-md"
      style={[rContainerStyle, { bottom: grossHeight + 16 }]}
    >
      <Pencil size={20} color="#e9967a" />
      <Animated.Text
        style={rTextOpacityStyle}
        className="absolute left-12 text-base text-[#e9967a]"
        maxFontSizeMultiplier={1}
      >
        Compose
      </Animated.Text>
    </AnimatedPressable>
  );
};
