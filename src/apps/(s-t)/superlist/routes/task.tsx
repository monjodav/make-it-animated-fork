import { Pressable, StyleSheet, Text, View } from "react-native";
import { FC, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  SharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { Check, ChevronLeft, EllipsisVertical } from "lucide-react-native";
import { cn } from "@/src/shared/lib/utils/cn";

type CrossLineItemProps = {
  line: { width: number; height: number; y: number };
  idx: number;
  lineProgress: SharedValue<number>;
  inputRange: number[][];
};

const CrossLineItem: FC<CrossLineItemProps> = ({ line, idx, lineProgress, inputRange }) => {
  const rLineStyle = useAnimatedStyle(() => {
    if (idx < inputRange.length) {
      return {
        width: interpolate(
          lineProgress.get(),
          inputRange[idx],
          [0, line.width],
          Extrapolation.CLAMP
        ),
      };
    }
    return { width: 0 };
  });

  return (
    <Animated.View
      key={idx}
      style={[
        {
          top: line.y + line.height / 2,
        },
        rLineStyle,
      ]}
      className="bg-red-500 absolute left-0 h-[2px]"
    />
  );
};

const DURATION = 200;

const Task = () => {
  const insets = useSafeAreaInsets();
  const [lines, setLines] = useState<{ width: number; height: number; y: number }[]>([]);

  const totalLength = lines.reduce((acc, line) => acc + line.width, 0);

  const lineProgress = useSharedValue(0);

  const [isClicked, setIsClicked] = useState(false);

  const getInputRange = (lines: { width: number }[], totalLength: number): number[][] => {
    const ranges: number[][] = [];
    let start = 0;
    for (let i = 0; i < lines.length; i++) {
      const end = start + lines[i].width / totalLength;
      if (i === lines.length - 1) {
        ranges.push([start, 1]);
      } else {
        ranges.push([start, end]);
      }
      start = end;
    }
    return ranges;
  };
  const inputRange = getInputRange(lines, totalLength);

  const crossLine = () => {
    if (lineProgress.get() === 0) {
      setIsClicked(true);
      lineProgress.set(withTiming(1, { duration: DURATION }));
    } else {
      setIsClicked(false);
      lineProgress.set(withTiming(0, { duration: DURATION }));
    }
  };

  const handlePress = () => {
    if (lines.length > 0) {
      crossLine();
    }
  };

  const rCheckMarkStyle = useAnimatedStyle(() => {
    const opacity = isClicked ? interpolate(lineProgress.get(), [0, 1], [0, 1]) : 0;
    const scale = isClicked ? interpolate(lineProgress.get(), [0, 1], [1.8, 1]) : 0;
    return {
      opacity: opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View className="flex-1 bg-[#242335]">
      <View className="bg-[#2B293F] px-4" style={{ paddingTop: insets.top + 20 }}>
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={simulatePress}
            className="p-2 rounded-full bg-slate-100/10 items-center justify-center"
          >
            <ChevronLeft size={24} color="white" />
          </Pressable>

          <Pressable
            onPress={simulatePress}
            className="p-2 rounded-full bg-slate-100/10 items-center justify-center"
          >
            <EllipsisVertical size={24} color="white" />
          </Pressable>
        </View>
        <View className="flex-row gap-3 items-start mt-6">
          <Pressable
            onPress={handlePress}
            style={styles.borderCurve}
            className={cn(
              "h-9 w-9 rounded-[12px] mt-1 border-[2px] border-white/20 items-center justify-center",
              isClicked && "border-red-500 bg-red-500"
            )}
          >
            <Animated.View style={rCheckMarkStyle}>
              <View style={{ transform: [{ scaleX: 0.7 }] }}>
                <Check size={24} color="white" />
              </View>
            </Animated.View>
          </Pressable>

          <View className="flex-1 self-start">
            <Text
              className={cn(
                "self-start text-4xl font-semibold text-white",
                isClicked && "text-white/40"
              )}
              onTextLayout={(e) => {
                setLines(
                  e.nativeEvent.lines.map((line) => ({
                    width: line.width,
                    height: line.height,
                    y: line.y,
                  }))
                );
              }}
            >
              Task test text test c fnnn texttest text texttest text
            </Text>
            {lines.map((line, idx) => (
              <CrossLineItem
                key={idx}
                line={line}
                idx={idx}
                lineProgress={lineProgress}
                inputRange={inputRange}
              />
            ))}
          </View>
        </View>
        <View className="h-9 w-1/3 rounded-full bg-slate-100/10 mt-8" />
        <View className="h-9 w-3/4 rounded-full bg-slate-100/10 mt-2 mb-6" />
      </View>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
