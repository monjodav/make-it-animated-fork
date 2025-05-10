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
    <TabsScreenAnimatedProvider>
      <View className="flex-1 bg-neutral-950">
        <ScreenTabs.Container
          headerContainerStyle={{
            backgroundColor: "transparent",
            shadowColor: "transparent",
          }}
          renderHeader={(props) => <CustomHeader {...props} />}
          renderTabBar={() => null}
          initialTabName={TabName.Main}
          onTabChange={(data) => {
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
