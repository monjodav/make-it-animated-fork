import React from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabsStore } from "../../../lib/store/tabs";
import { Plus } from "lucide-react-native";
import { TabName } from "../../../lib/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AddTabButton = () => {
  const focusedTabName = useTabsStore.use.focusedTabName();
  const addTabItem = useTabsStore.use.addTabItem();

  const rContainerStyle = useAnimatedStyle(() => {
    if (focusedTabName === TabName.Main) {
      return {
        backgroundColor: "#60a5fa",
        opacity: 1,
        pointerEvents: "auto",
      };
    }

    if (focusedTabName === TabName.Incognito) {
      return {
        backgroundColor: "white",
        opacity: 1,
        pointerEvents: "auto",
      };
    }

    return {
      opacity: 0,
      pointerEvents: "none",
    };
  });

  return (
    <AnimatedPressable
      className="p-1.5 rounded-full bg-blue-400"
      style={rContainerStyle}
      onPress={() => {
        if (focusedTabName === TabName.Main) {
          addTabItem(TabName.Main);
        }

        if (focusedTabName === TabName.Incognito) {
          addTabItem(TabName.Incognito);
        }
      }}
    >
      <Plus size={24} color="black" strokeWidth={2.5} />
    </AnimatedPressable>
  );
};
