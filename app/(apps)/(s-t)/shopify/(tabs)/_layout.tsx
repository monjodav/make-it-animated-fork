import { Tabs } from "expo-router";
import React from "react";
import { CustomTabBar, Tab } from "@/src/apps/(s-t)/shopify/components/custom-tab-bar";

// shopify-menu-transition-animation 🔽

const TabsLayout = () => {
  return (
    <Tabs
      // shopify-custom-bottom-tab-bar-animation 🔽
      // Custom tab bar injected at the router level so it can:
      // - read focus state to drive per-tab animations
      // - react to shared values (e.g., menuProgress) for coordinated choreography
      tabBar={(props) => <CustomTabBar {...props} />}
      // shopify-custom-bottom-tab-bar-animation 🔼
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "black" },
      }}
    >
      <Tabs.Screen name={Tab.Search} />
      <Tabs.Screen name={Tab.Home} />
      <Tabs.Screen name={Tab.Orders} />
      <Tabs.Screen name={Tab.Products} />
      <Tabs.Screen name={Tab.Profile} />
    </Tabs>
  );
};

export default TabsLayout;

// shopify-menu-transition-animation 🔼
