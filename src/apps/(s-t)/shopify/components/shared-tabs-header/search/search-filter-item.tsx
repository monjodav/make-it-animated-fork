import { Pressable, Text } from "react-native";
import { ListFilter } from "lucide-react-native";
import type { RefObject } from "react";
import type { FlatList } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";

// shopify-search-screen-top-tabs-animation 🔽

type FilterItemProps = {
  item: string;
  index: number;
  pressedItem: SharedValue<string | null>;
  activeFilterItem: string | null;
  flatListRef: RefObject<FlatList<string> | null>;
  setActiveFilterItem: (item: string) => void;
};

const FilterItem = ({
  item,
  index,
  pressedItem,
  activeFilterItem,
  flatListRef,
  setActiveFilterItem,
}: FilterItemProps) => {
  const isActive = activeFilterItem === item;

  /**
   * useDerivedValue keeps press state on the UI thread (no React re-render).
   * This makes press-in feedback instantaneous even while the list is scrolling.
   */
  const isPressed = useDerivedValue(() => pressedItem.get() === item, [item]);

  /**
   * Animated style toggles chip background based on two signals:
   * - isPressed (transient): darker gray for tactile feedback (#737373)
   * - isActive (selected): persistent state color (#303030)
   * Priority: pressed overrides active for immediate feedback.
   */
  const animatedContainerStyle = useAnimatedStyle(() => {
    const bg = isPressed.get() ? "#737373" : isActive ? "#303030" : "transparent";
    return { backgroundColor: bg };
  });

  return (
    <Pressable
      /* SharedValue write avoids triggering React state updates.
       * onPressIn/out provide fast visual feedback vs onPress only.
       */
      onPressIn={() => pressedItem.set(item)}
      onPressOut={() => pressedItem.set(null)}
      onPress={() => {
        setActiveFilterItem(item);
        // Center the selected tab in view for better discoverability (viewPosition: 0.5)
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }}
      className="rounded-full"
    >
      <Animated.View
        className="flex-row gap-2 items-center justify-center px-4 py-1 rounded-full"
        style={animatedContainerStyle}
      >
        {item === "All filters" ? <ListFilter size={18} color={"#E5E7EB"} /> : null}
        <Text className="text-lg text-gray-200 ">{item}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default FilterItem;

// shopify-search-screen-top-tabs-animation 🔼
