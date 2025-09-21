import React, { FC } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { CircleX, ScanBarcode, SearchIcon } from "lucide-react-native";
import { TextInput } from "react-native";
import { useRouter } from "expo-router";

// shopify-tabs-shared-header-animation 🔽

export const SearchBar: FC = () => {
  const [query, setQuery] = useState<string>("");

  const router = useRouter();

  return (
    <View className="flex-1 rounded-2xl justify-center bg-[#303030]">
      <SearchIcon size={18} color="#B5B5B5" style={styles.searchIcon} />
      <TextInput
        value={query}
        onChangeText={(value) => {
          setQuery(value);
          router.setParams({ query: value });
        }}
        placeholder="Search"
        placeholderTextColor="#B5B5B5"
        className="px-10 h-full text-base/5 text-[#B5B5B5]"
        autoFocus
      />

      {query ? (
        <Pressable
          onPress={() => {
            setQuery("");
            router.setParams({ query: "" });
          }}
          style={styles.scanIcon}
        >
          <CircleX size={18} color="#B5B5B5" />
        </Pressable>
      ) : (
        <Pressable style={styles.scanIcon}>
          <ScanBarcode size={18} color="#B5B5B5" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    position: "absolute",
    left: 11,
  },
  scanIcon: {
    position: "absolute",
    right: 13,
  },
});

// shopify-tabs-shared-header-animation 🔼
