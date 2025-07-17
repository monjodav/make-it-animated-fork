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

// Fixed header height matches LinkedIn's compact header design
export const _headerHeight = 45;
// Threshold defines minimum scroll-up distance (75px) required to show header
// LinkedIn uses a generous threshold to prevent accidental header reveals during small scroll reversals
const _threshold = 75;
// 250ms duration creates smooth transitions without feeling sluggish
const _animDuration = 250;

type Props = {
  scrollDirection: ScrollDirectionValue;
  offsetY: SharedValue<number>;
  offsetYAnchorOnBeginDrag: SharedValue<number>;
};

export const HomeHeader = ({ scrollDirection, offsetY, offsetYAnchorOnBeginDrag }: Props) => {
  const insets = useSafeAreaInsets();

  // Track the previous header state to maintain hidden state when appropriate
  // This state persistence prevents header flickering during small scroll reversals
  const prevHeaderState = useSharedValue<"hidden" | "visible">("visible");

  // Derived value calculates header visibility based on complex LinkedIn-style scroll rules
  // This reactive approach ensures the header responds immediately to scroll changes
  const headerState = useDerivedValue(() => {
    // Always show header at scroll position zero
    // This ensures header is visible when content is at natural resting position
    if (offsetY.value <= 0) {
      return "visible";
    }

    // Hide header on downward scroll to maximize content area
    // The anchor comparison ensures we only hide after scrolling past the initial touch point
    // This prevents header hiding during small scroll bounces or direction changes
    if (scrollDirection.value === "to-bottom" && offsetY.value > offsetYAnchorOnBeginDrag.value) {
      prevHeaderState.value = "hidden";
      return "hidden";
    }

    // Progressive reveal logic - only show header after significant upward scroll
    // LinkedIn's UX requires deliberate upward scroll (75px threshold) to reveal header
    // This prevents accidental reveals during scroll direction changes
    if (scrollDirection.value === "to-top") {
      // Calculate distance scrolled up from anchor point (where drag began)
      const scrollUpDistance = offsetYAnchorOnBeginDrag.value - offsetY.value;
      if (scrollUpDistance >= _threshold) {
        prevHeaderState.value = "visible";
        return "visible";
      } else {
        // Still scrolling up but haven't reached threshold yet
        // Keep previous state (which is likely hidden) to avoid premature reveals
        return prevHeaderState.value;
      }
    }

    // For any other case, return the previous state
    return prevHeaderState.value;
  });

  // Animated placeholder maintains content position during header transitions
  // This prevents content from jumping when header shows/hides
  const rHeaderPlaceholderStyle = useAnimatedStyle(() => ({
    // Height dynamically matches header's current state with smooth timing
    // Using the same duration as header animation ensures perfect synchronization
    height: withTiming(headerState.value === "hidden" ? 0 : _headerHeight, {
      duration: _animDuration,
    }),
  }));

  // Primary header animation style combining opacity and translation effects
  // LinkedIn uses a dual-animation approach (fade + translate) for smoother transitions
  const rHeaderStyle = useAnimatedStyle(() => {
    return {
      // Fade animation enhances the sliding effect with reduced visual harshness
      // Full opacity (1) when visible ensures header content is completely clear
      opacity: withTiming(headerState.value === "hidden" ? 0 : 1, {
        duration: _animDuration,
      }),
      transform: [
        {
          // Translation moves header completely off-screen including safe area
          // The negative offset (-headerHeight - insets.top) ensures no partial visibility
          translateY: withTiming(headerState.value === "hidden" ? -_headerHeight - insets.top : 0, {
            duration: _animDuration,
          }),
        },
      ],
    };
  });

  return (
    <>
      {/* Placeholder maintains content position during header animation */}
      <Animated.View style={rHeaderPlaceholderStyle} />
      {/* Animated.View automatically creates optimized native view for animation performance */}
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
