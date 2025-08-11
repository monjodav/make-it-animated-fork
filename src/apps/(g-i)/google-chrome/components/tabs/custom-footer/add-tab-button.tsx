import React from "react";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabsStore } from "../../../lib/store/tabs";
import { Plus } from "lucide-react-native";
import { TabName } from "../../../lib/types";

// google-chrome-footer-animation 🔽

// Wrap Pressable to allow Reanimated to drive its style/props on UI thread.
// Ref: createAnimatedComponent docs – needed for opacity/pointerEvents animation.
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AddTabButton = () => {
  const focusedTabName = useTabsStore.use.focusedTabName();
  const addTabItem = useTabsStore.use.addTabItem();

  // Container animates visibility based on which tab is focused.
  // WHY: Chrome shows a blue (+) in Main and a white (+) in Incognito; hide otherwise.
  // pointerEvents toggles interactivity in sync with opacity to avoid ghost taps during transitions.
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

// google-chrome-footer-animation 🔼
