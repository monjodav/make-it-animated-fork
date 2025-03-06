import { ScrollDirectionValue } from "@/hooks/use-relative-scroll-direction";
import { MessageSquareMore, Search, SquarePen } from "lucide-react-native";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// linkedin-header-on-scroll-animation 🔽

export const _headerHeight = 45;
const _animDuration = 250;

type Props = {
  scrollDirection: ScrollDirectionValue;
};

export const HomeHeader = ({ scrollDirection }: Props) => {
  const insets = useSafeAreaInsets();

  const rHeaderPlaceholderStyle = useAnimatedStyle(() => ({
    height: withTiming(scrollDirection.value === "to-bottom" ? 0 : _headerHeight, {
      duration: _animDuration,
    }),
  }));

  const rHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(scrollDirection.value === "to-bottom" ? 0 : 1, {
        duration: _animDuration,
      }),
      transform: [
        {
          translateY: withTiming(
            scrollDirection.value === "to-bottom" ? -_headerHeight - insets.top : 0,
            {
              duration: _animDuration,
            }
          ),
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
