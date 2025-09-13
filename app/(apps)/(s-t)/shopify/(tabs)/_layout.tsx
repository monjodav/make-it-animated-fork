import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { MenuProvider } from "@/src/apps/(s-t)/shopify/lib/providers/menu-provider";
import { Menu as MenuOverlay } from "@/src/apps/(s-t)/shopify/components/menu";
import { AnimatedTabsContainer } from "@/src/apps/(s-t)/shopify/components/animated-tabs-container";
import { CustomTabBar, Tab } from "@/src/apps/(s-t)/shopify/components/custom-tab-bar";

// shopify-menu-transition-animation 🔽

const TabsLayout = () => {
  return (
    <MenuProvider>
      <View className="flex-1 bg-black">
        {/* AnimatedTabsContainer hosts cross-screen shared values (e.g., scroll offsets, menu progress)
            to coordinate header and tab bar animations at the layout level */}
        <AnimatedTabsContainer>
          <Tabs
            // shopify-custom-bottom-tab-bar-animation 🔽
            // Inject custom tab bar here so it can read navigation focus state and drive per-button animations
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
        </AnimatedTabsContainer>
        {/* 
          Menu overlay and close button are rendered at layout level
          This prevents circular dependencies while maintaining shared animation state
        */}
        {/* Overlay sits outside Tabs so the menu animation can spring in over any tab without remounting */}
        <MenuOverlay />
      </View>
    </MenuProvider>
  );
};

export default TabsLayout;

// shopify-menu-transition-animation 🔼
