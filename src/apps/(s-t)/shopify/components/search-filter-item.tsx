import { Pressable, Text } from "react-native";
import { ListFilter } from "lucide-react-native";
import type { RefObject } from "react";
import type { FlatList } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";

// shopify-search-screen-animation 🔽

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

  // Derive press state from shared value so it updates without React re-render
  const isPressed = useDerivedValue(() => pressedItem.get() === item, [item]);

  // Animated background that reacts to both pressed and active states
  const animatedContainerStyle = useAnimatedStyle(() => {
    const bg = isPressed.get() ? "#737373" : isActive ? "#303030" : "transparent";
    return { backgroundColor: bg };
  });

  return (
    <Pressable
      onPressIn={() => pressedItem.set(item)}
      onPressOut={() => pressedItem.set(null)}
      onPress={() => {
        setActiveFilterItem(item);
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }}
      className="rounded-full"
    >
      <Animated.View
        // static layout via className; dynamic bg via animated style
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

// shopify-search-screen-animation 🔼
