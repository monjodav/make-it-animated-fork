import { IosHeader } from "@/components/_shared/ios-header";
import { Camera, Plus, SquarePen } from "lucide-react-native";
import React from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { IosHeaderProvider } from "@/components/_shared/ios-header/provider";
import { ChatsList } from "@/components/viber/chats-list";

// viber-chats-header-animation 🔽

export default function Chats() {
  return (
    <IosHeaderProvider>
      <View className="flex-1 bg-black">
        <IosHeader
          smallTitle="Chats"
          bigTitle="Chats"
          right={
            <View className="flex-row items-center gap-5 pr-4">
              <TouchableOpacity
                activeOpacity={0.9}
                hitSlop={15}
                onPress={() => Alert.alert("Take a photo")}
              >
                <Camera size={20} color="#7F61F2" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                hitSlop={15}
                onPress={() => Alert.alert("Create a chat")}
              >
                <SquarePen size={18} color="#7F61F2" />
              </TouchableOpacity>
            </View>
          }
          bottom={
            <View className="flex-row items-center gap-2 mt-1">
              <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900 border border-[#7F61F2]/50">
                <Text className="text-neutral-300 text-sm">All</Text>
              </View>
              <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900">
                <Text className="text-neutral-300 text-sm">
                  <Text className="text-xs">⭐</Text> Favorites
                </Text>
              </View>
              <View className="w-8 h-8 items-center justify-center rounded-full bg-neutral-900">
                <Plus size={14} color="#7F61F280" />
              </View>
            </View>
          }
        />
        <ChatsList />
      </View>
    </IosHeaderProvider>
  );
}

// viber-chats-header-animation 🔼
