import React, { FC } from "react";
import { Pressable } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { usePathname } from "expo-router";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { ChevronDown, PlusCircle } from "lucide-react-native";
import { Tab } from "../custom-tab-bar";

// shopify-tabs-shared-header-animation 🔽

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const OrdersProducts: FC = () => {
  const pathname = usePathname();

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      className="flex-row items-center justify-between"
    >
      <AnimatedPressable
        layout={LinearTransition}
        className="flex-row items-center gap-1"
        // Different onPress logic can be handled depending on pathname
        onPress={simulatePress}
      >
        {pathname.includes(Tab.Orders) && (
          <Animated.Text
            key="orders"
            entering={FadeIn.duration(150)}
            layout={LinearTransition}
            className="text-2xl font-bold text-white"
          >
            Orders
          </Animated.Text>
        )}
        {pathname.includes(Tab.Products) && (
          <Animated.Text
            key="products"
            entering={FadeIn.duration(150)}
            layout={LinearTransition}
            className="text-2xl font-bold text-white"
          >
            Products
          </Animated.Text>
        )}
        <Animated.View layout={LinearTransition} className="mt-1">
          <ChevronDown size={20} color="white" />
        </Animated.View>
      </AnimatedPressable>
      {/* Different onPress logic can be handled depending on pathname */}
      <Pressable onPress={simulatePress}>
        <PlusCircle size={20} color="white" />
      </Pressable>
    </Animated.View>
  );
};

// shopify-tabs-shared-header-animation 🔼
