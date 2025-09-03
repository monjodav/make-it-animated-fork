import { Tabs } from "expo-router";
import React from "react";

enum Tab {
  Search = "search",
}

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name={Tab.Search} options={{}} />
    </Tabs>
  );
};

export default TabsLayout;
