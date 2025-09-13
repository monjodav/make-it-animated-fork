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
        {/* AnimatedTabsContainer
            Why: centralizes cross-screen shared values (scroll offsets, menuProgress)
            so header/tab/menu animations can run on the UI thread without prop-drilling. */}
        <AnimatedTabsContainer>
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
        </AnimatedTabsContainer>
        {/* 
          Menu overlay and close button live at the layout level.
          Why: render above all tabs to animate in-place across screens, avoid remounts,
          and prevent circular dependencies while still accessing shared values.
        */}
        {/* Overlay sits outside <Tabs> so the spring-in animation can cover any tab content. */}
        <MenuOverlay />
      </View>
    </MenuProvider>
  );
};

export default TabsLayout;

// shopify-menu-transition-animation 🔼
