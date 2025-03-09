import { ScrollDirectionValue } from "@/src/shared/lib/hooks/use-scroll-direction";
import { MessageSquareMore, Search, SquarePen } from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// linkedin-header-on-scroll-animation 🔽

export const _headerHeight = 45;
const _threshold = 75;
const _animDuration = 250;

type Props = {
  scrollDirection: ScrollDirectionValue;
  offsetY: SharedValue<number>;
  offsetYAnchorOnBeginDrag: SharedValue<number>;
};

export const HomeHeader = ({ scrollDirection, offsetY, offsetYAnchorOnBeginDrag }: Props) => {
  const insets = useSafeAreaInsets();

  // Track the previous header state to maintain hidden state when appropriate
  const prevHeaderState = useSharedValue<"hidden" | "visible">("visible");

  const headerState = useDerivedValue(() => {
    // Always show at the very top
    if (offsetY.value <= 0) {
      return "visible";
    }

    // Hide when scrolling down
    if (scrollDirection.value === "to-bottom" && offsetY.value > offsetYAnchorOnBeginDrag.value) {
      prevHeaderState.value = "hidden";
      return "hidden";
    }

    // Only show when scrolling up AND passed the threshold
    if (scrollDirection.value === "to-top") {
      const scrollUpDistance = offsetYAnchorOnBeginDrag.value - offsetY.value;
      if (scrollUpDistance >= _threshold) {
        prevHeaderState.value = "visible";
        return "visible";
      } else {
        // Still scrolling up but haven't reached threshold yet
        // Keep previous state (which is likely hidden)
        return prevHeaderState.value;
      }
    }

    // For any other case, return the previous state
    return prevHeaderState.value;
  });

  const rHeaderPlaceholderStyle = useAnimatedStyle(() => ({
    height: withTiming(headerState.value === "hidden" ? 0 : _headerHeight, {
      duration: _animDuration,
    }),
  }));

  const rHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(headerState.value === "hidden" ? 0 : 1, {
        duration: _animDuration,
      }),
      transform: [
        {
          translateY: withTiming(headerState.value === "hidden" ? -_headerHeight - insets.top : 0, {
            duration: _animDuration,
          }),
        },
      ],
    };
  });

  return (
    <>
      <Animated.View style={rHeaderPlaceholderStyle} />
      <Animated.View
        className="absolute left-0 right-0 border-b border-linkedin-front z-50 bg-linkedin-back flex-row items-center justify-between px-8 py-2 gap-2"
        style={[rHeaderStyle, { height: _headerHeight, top: insets.top }]}
      >
        <View className="h-full aspect-square bg-linkedin-front rounded-full" />
        <View className="flex-1 h-full flex-row items-center gap-2 bg-linkedin-front px-2 py-1 rounded-md">
          <Search size={14} color="#96999b" />
          <Text className="text-sm text-[#96999b]">Search</Text>
        </View>
        <View className="flex-row items-center gap-4 ml-2">
          <SquarePen size={20} color="#96999b" />
          <MessageSquareMore size={20} color="#96999b" />
        </View>
      </Animated.View>
    </>
  );
};

// linkedin-header-on-scroll-animation 🔼
