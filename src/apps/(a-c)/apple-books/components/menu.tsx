import { cn } from "@/src/shared/lib/utils/cn";
import React, { FC, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuButtons } from "./menu-buttons";
import { MenuTrigger } from "./menu-trigger";

// apple-books-menu-buttons-animation 🔽

export const Menu: FC = () => {
  // Central state management for menu open/closed - drives all child animations
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject, // Overlay entire screen for proper touch handling
        {
          bottom: insets.bottom + 16, // Respect safe area with additional padding
        },
      ]}
      className={cn(
        "items-end justify-end px-5 pointer-events-box-none", // Right-aligned positioning, selective touch handling
        isMenuOpen && "pointer-events-auto" // Enable full interaction when menu is open
      )}
    >
      {/* Invisible backdrop for tap-to-close when menu is open */}
      {isMenuOpen && (
        <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setIsMenuOpen(false)} />
      )}
      <MenuButtons isOpen={isMenuOpen} />
      <MenuTrigger isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </View>
  );
};

// apple-books-menu-buttons-animation 🔼
