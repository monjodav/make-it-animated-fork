import React from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import { IosHeaderProvider } from "@/components/_shared/ios-header/provider";
import { IosHeader } from "@/components/_shared/ios-header";
import { MoreHorizontal } from "lucide-react-native";
import { UpdatesContent } from "@/components/whatsapp/updates-content";

export default function Updates() {
  return (
    <IosHeaderProvider>
      <View className="flex-1 bg-neutral-950">
        <IosHeader
          smallTitle="Updates"
          bigTitle="Updates"
          left={
            <TouchableOpacity
              activeOpacity={0.9}
              hitSlop={15}
              onPress={() => Alert.alert("More")}
              className="ml-6 bg-neutral-800 rounded-full p-1"
            >
              <MoreHorizontal size={18} color="gray" />
            </TouchableOpacity>
          }
          bgColor="#0a0a0a"
        />
        <UpdatesContent />
      </View>
    </IosHeaderProvider>
  );
}
