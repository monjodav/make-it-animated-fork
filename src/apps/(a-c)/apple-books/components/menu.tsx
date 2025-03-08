import { cn } from "@/src/lib/utils/cn";
import React, { FC, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuButtons } from "./menu-buttons";
import { MenuTrigger } from "./menu-trigger";

// apple-books-menu-buttons-animation 🔽

export const Menu: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          bottom: insets.bottom,
        },
      ]}
      className={cn(
        "items-end justify-end px-5 pointer-events-box-none",
        isMenuOpen && "pointer-events-auto"
      )}
    >
      {isMenuOpen && (
        <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setIsMenuOpen(false)} />
      )}
      <MenuButtons isOpen={isMenuOpen} />
      <MenuTrigger isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </View>
  );
};

// apple-books-menu-buttons-animation 🔼
