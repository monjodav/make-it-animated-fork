import React from "react";
import { View } from "react-native";

import { Incognito } from "../components/tabs/incognito";
import { Main } from "../components/tabs/main";
import { Groups } from "../components/tabs/groups";
import { Tabs as ScreenTabs } from "react-native-collapsible-tab-view";
import { TabName } from "../lib/types";
import { CustomHeader } from "../components/tabs/custom-header";
import { TabsScreenAnimatedProvider } from "../lib/providers/tabs-screen-animated-provider";
import { CustomFooter } from "../components/tabs/custom-footer";
import { useTabsStore } from "../lib/store/tabs";

// google-chrome-top-tabs-indicator-animation 🔽

export default function Tabs() {
  const setFocusedTabName = useTabsStore.use.setFocusedTabName();

  return (
    // Provider exposes shared animated values (e.g., offsetY) to header/footer.
    // This keeps scroll-driven header background and tab indicator in sync.
    <TabsScreenAnimatedProvider>
      <View className="flex-1 bg-neutral-950">
        <ScreenTabs.Container
          // Transparent header; background/blur are fully controlled by CustomHeader.
          headerContainerStyle={{
            backgroundColor: "transparent",
            shadowColor: "transparent",
          }}
          // CustomHeader receives indexDecimal for continuous tab interpolation.
          renderHeader={(props) => <CustomHeader {...props} />}
          // Hide default tab bar; we render a Chrome-like capsule bar in header.
          renderTabBar={() => null}
          initialTabName={TabName.Main}
          onTabChange={(data) => {
            // Store sync can be used by other UI (e.g., footer) to reflect focus.
            setFocusedTabName(data.tabName as TabName);
          }}
        >
          <ScreenTabs.Tab name={TabName.Incognito}>
            <Incognito />
          </ScreenTabs.Tab>
          <ScreenTabs.Tab name={TabName.Main}>
            <Main />
          </ScreenTabs.Tab>
          <ScreenTabs.Tab name={TabName.Groups}>
            <Groups />
          </ScreenTabs.Tab>
        </ScreenTabs.Container>
        <CustomFooter />
      </View>
    </TabsScreenAnimatedProvider>
  );
}

// google-chrome-top-tabs-indicator-animation 🔼
