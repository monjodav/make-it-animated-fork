import React, { FC } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";
import { CustomTabBar } from "../components/custom-tab-bar.tsx";
import { TAB_BAR_HEIGHT } from "../lib/constants/account";

// discord-top-tabs-indicator-animation 🔽

export const Account: FC = () => {
  return (
    <View className="flex-1 bg-[#1C1D24] pt-4">
      <Tabs.Container
        headerContainerStyle={styles.headerContainerStyle}
        renderTabBar={(props) => <CustomTabBar {...props} />}
        initialTabName="Security"
      >
        <Tabs.Tab name="Security">
          <ScrollView
            contentContainerClassName="px-4 gap-6"
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            <View className=" h-[200px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
            <View className=" h-[120px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
            <View className=" h-[180px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
            <View className=" h-[100px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
          </ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Standing">
          <ScrollView
            contentContainerClassName="px-4"
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            <View className=" h-[300px] rounded-2xl bg-[#25272F]" style={styles.borderCurve} />
          </ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainerStyle: {
    backgroundColor: "#1C1D24",
    shadowColor: "transparent",
  },
  contentContainerStyle: {
    paddingTop: TAB_BAR_HEIGHT + 30,
  },
  borderCurve: {
    borderCurve: "continuous",
  },
});

// discord-top-tabs-indicator-animation 🔼
