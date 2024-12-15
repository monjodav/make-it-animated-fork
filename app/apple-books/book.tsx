import { Menu } from "@/components/apple-books/menu";
import { MenuTrigger } from "@/components/apple-books/menu-trigger";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Book() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-black"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center px-5">
        <View className="w-[60px] h-5 rounded-full bg-neutral-800 mb-10" />
        <View className="w-[200px] h-8 rounded-full bg-neutral-800 mb-1" />
        <View className="w-[180px] h-8 rounded-full bg-neutral-800 mb-[50px]" />
        <View className="w-[80px] h-1 rounded-full bg-neutral-800 mb-[50px]" />
        <View className="w-[90px] h-6 rounded-full bg-neutral-800 mb-10" />
      </View>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            bottom: insets.bottom,
          },
        ]}
        className="items-end justify-end px-5"
      >
        {isMenuOpen && (
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setIsMenuOpen(false)} />
        )}
        <Menu isOpen={isMenuOpen} />
        <MenuTrigger setIsOpen={setIsMenuOpen} />
      </View>
    </View>
  );
}
