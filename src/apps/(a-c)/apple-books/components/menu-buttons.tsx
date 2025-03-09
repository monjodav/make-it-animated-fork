import { cn } from "@/src/shared/lib/utils/cn";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Bookmark, Logs, Rows3, Search } from "lucide-react-native";
import React, { FC } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { MenuButtonsWrapper } from "./menu-buttons-wrapper";

// apple-books-menu-buttons-animation 🔽

const _iconSize = 20;
const _iconColor = "#d4d4d4";

const className = {
  button: "px-5 py-3 rounded-2xl bg-neutral-800 flex-row items-center justify-between",
  text: "text-stone-100 text-lg",
};

type Props = {
  isOpen: boolean;
};

export const MenuButtons: FC<Props> = ({ isOpen }) => {
  return (
    <MenuButtonsWrapper isOpen={isOpen}>
      <Pressable
        className={cn(className.button, "bg-neutral-600")}
        style={styles.button}
        onPress={() => Alert.alert("Contents")}
      >
        <Text className={className.text}>Contents • 0%</Text>
        <Logs size={_iconSize} color={_iconColor} />
      </Pressable>
      <Pressable
        className={className.button}
        style={styles.button}
        onPress={() => Alert.alert("Search Book")}
      >
        <Text className={className.text}>Search Book</Text>
        <Search size={_iconSize} color={_iconColor} />
      </Pressable>
      <Pressable
        className={className.button}
        style={styles.button}
        onPress={() => Alert.alert("Themes & Settings")}
      >
        <Text className={className.text}>Themes & Settings</Text>
        <View className="flex-row items-center">
          <Text className="text-[14px] text-neutral-100 mt-1 font-semibold">A</Text>
          <Text className="text-[20px] text-neutral-100 font-medium">A</Text>
        </View>
      </Pressable>
      <View className="flex-row gap-1">
        <Pressable
          className={className.button}
          style={styles.button}
          onPress={() => Alert.alert("Share")}
        >
          <Feather name="share" size={_iconSize} color={_iconColor} />
        </Pressable>
        <Pressable
          className={className.button}
          style={styles.button}
          onPress={() => Alert.alert("Lock Reset")}
        >
          <MaterialIcons name="lock-reset" size={_iconSize} color={_iconColor} />
        </Pressable>
        <Pressable
          className={className.button}
          style={styles.button}
          onPress={() => Alert.alert("Line Guide")}
        >
          <Rows3 size={_iconSize} color={_iconColor} />
        </Pressable>
        <Pressable
          className={className.button}
          style={styles.button}
          onPress={() => Alert.alert("Bookmark")}
        >
          <Bookmark size={_iconSize} color={_iconColor} />
        </Pressable>
      </View>
    </MenuButtonsWrapper>
  );
};

const styles = StyleSheet.create({
  button: {
    borderCurve: "continuous",
    transformOrigin: "right",
  },
});

// apple-books-menu-buttons-animation 🔼
