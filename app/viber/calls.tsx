import React, { useState } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TopTabs } from "@/components/viber/top-tabs";
import { IosHeaderProvider } from "@/components/_shared/ios-header/provider";
import { IosHeader } from "@/components/_shared/ios-header";
import { CallsList } from "@/components/viber/calls-list";
import { CallsRecentList } from "@/components/viber/calls-recent-list";

export enum Tab {
  Contacts = 0,
  Recent = 1,
}

export default function Calls() {
  const [activeTab, setActiveTab] = useState(Tab.Contacts);

  return (
    <IosHeaderProvider>
      <View className="flex-1 bg-black">
        <IosHeader
          smallTitle="Calls"
          bigTitle="Calls"
          right={
            <View className="flex-row items-center gap-5 pr-4">
              <TouchableOpacity
                activeOpacity={0.9}
                hitSlop={15}
                onPress={() => Alert.alert("Add contact")}
              >
                <FontAwesome6 name="user-plus" size={18} color="#7F61F2" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                hitSlop={15}
                onPress={() => Alert.alert("Open keypad")}
              >
                <Ionicons name="keypad" size={18} color="#7F61F2" />
              </TouchableOpacity>
            </View>
          }
          bottom={
            <View className="gap-2">
              <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <View className="h-px bg-neutral-800/75 mt-3 -mx-5" />
              {activeTab === Tab.Contacts && (
                <View className="h-[75px] bg-neutral-900 rounded-2xl" />
              )}
            </View>
          }
          hideSearchBarOnScroll={false}
        />
        {activeTab === Tab.Contacts && <CallsList />}
        {activeTab === Tab.Recent && <CallsRecentList />}
      </View>
    </IosHeaderProvider>
  );
}
