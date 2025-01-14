import { Search } from "lucide-react-native";
import React, { FC } from "react";
import { View, StyleSheet, TextInput } from "react-native";

type Props = {};

export const SearchBar: FC<Props> = ({}) => {
  return (
    <View className="justify-center">
      <TextInput
        className="h-10 rounded-full bg-neutral-900 px-4 pl-8"
        placeholder="Search"
        placeholderTextColor="gray"
      />
      <Search size={16} color="gray" style={styles.searchIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchIcon: {
    position: "absolute",
    left: 6,
  },
});
