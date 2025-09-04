import { Pressable, Text } from "react-native";
import { ListFilter } from "lucide-react-native";
import type { RefObject } from "react";
import type { FlatList } from "react-native";

// shopify-search-screen-animation 🔽

type FilterItemProps = {
  item: string;
  index: number;
  pressedItem: string | null;
  activeFilterItem: string | null;
  flatListRef: RefObject<FlatList<string> | null>;
  setPressedItem: (item: string | null) => void;
  setActiveFilterItem: (item: string) => void;
};

const FilterItem = ({
  item,
  index,
  pressedItem,
  activeFilterItem,
  flatListRef,
  setPressedItem,
  setActiveFilterItem,
}: FilterItemProps) => {
  const isActive = activeFilterItem === item;
  const isPressed = pressedItem === item;

  // These color states simulate "press in/out" and active highlighting.
  // Darker shade when active, mid-gray when pressed for tactile feedback.
  let containerStyle = "flex-row gap-2 items-center justify-center px-4 py-1 rounded-full";

  if (isPressed) {
    containerStyle += " bg-[#737373]";
  } else if (isActive) {
    containerStyle += " bg-[#303030]";
  }

  return (
    <Pressable
      key={item}
      onPressIn={() => setPressedItem(item)}
      onPressOut={() => setPressedItem(null)}
      onPress={() => {
        setActiveFilterItem(item);
        /**
         * Scroll-to-index centers the tapped filter ~45% across the screen.
         * This ensures visibility without snapping hard to edges.
         */
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }}
      className={containerStyle}
    >
      {item === "All filters" ? <ListFilter size={18} color={"#E5E7EB"} /> : null}
      <Text className="text-lg text-gray-200 ">{item}</Text>
    </Pressable>
  );
};

export default FilterItem;

// shopify-search-screen-animation 🔼
