import React from "react";
import { usePathname } from "expo-router";
import { Tab } from "../custom-tab-bar";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "./search";
import { SEARCH_BAR_HEIGHT, SEARCH_FILTERS_HEIGHT } from "../../lib/constants/styles";
import { Home } from "./home";
import { OrdersProducts } from "./orders-products";
import { Profile } from "./profile";

// shopify-tabs-shared-header-animation 🔽

export const SharedTabsHeader = () => {
  const pathname = usePathname();

  const insets = useSafeAreaInsets();

  const rContainerStyle = useAnimatedStyle(() => {
    const searchScreenHeaderHeight = insets.top + 18 + SEARCH_BAR_HEIGHT + SEARCH_FILTERS_HEIGHT;
    const restScreenHeaderHeight = insets.top + 50;

    return {
      height: withSpring(
        pathname.endsWith(Tab.Search) ? searchScreenHeaderHeight : restScreenHeaderHeight,
        {
          damping: 32,
          stiffness: 320,
        }
      ),
    };
  });

  return (
    <Animated.View className="px-5" style={[{ paddingTop: insets.top + 12 }, rContainerStyle]}>
      {pathname.endsWith(Tab.Search) && <Search />}
      {pathname.endsWith(Tab.Home) && <Home />}
      {(pathname.endsWith(Tab.Orders) || pathname.endsWith(Tab.Products)) && <OrdersProducts />}
      {pathname.endsWith(Tab.Profile) && <Profile />}
    </Animated.View>
  );
};

// shopify-tabs-shared-header-animation 🔼
