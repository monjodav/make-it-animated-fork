import { Tabs } from "expo-router";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { CustomTabBar } from "@/src/apps/(g-i)/gmail/components/custom-tab-bar";
import { AnimatedScrollListProvider } from "@/src/apps/(g-i)/gmail/lib/providers/animated-scroll-list-provider";

export enum Tab {
  Inbox = "inbox",
  Meet = "meet",
}

const TabsLayout = () => {
  return (
    <AnimatedScrollListProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen name={Tab.Inbox} />
        <Tabs.Screen name={Tab.Meet} />
      </Tabs>
    </AnimatedScrollListProvider>
  );
};

export default TabsLayout;
