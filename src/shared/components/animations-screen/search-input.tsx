import { Platform, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { Search, X } from "lucide-react-native";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  return (
    <>
      <Text className="text-white mb-2">Search</Text>
      <View
        className="flex-row items-center gap-2 rounded-xl h-11 px-3 mb-1 overflow-hidden"
        style={{
          backgroundColor: Platform.OS === "ios" ? "#515151" : "#1C1C1C",
          borderWidth: Platform.OS === "ios" ? 0 : 1,
          borderColor: Platform.OS === "ios" ? "transparent" : "#303030",
        }}
      >
        {Platform.OS === "ios" ? (
          <>
            <View className="absolute h-11 left-0.5 right-0.5 top-1 bg-[#1C1C1C] rounded-xl shadow-[-4_-3_3_#1C1C1C]" />
            <View className="absolute h-11 left-0.5 right-0.5 top-1 bg-[#1C1C1C] rounded-xl shadow-[4_-3_3_#1C1C1C]" />
          </>
        ) : null}
        <Search size={16} color="#a8a29e" className="self-center mr-2" />
        <TextInput
          placeholder="Animation..."
          placeholderTextColor="#a8a29e"
          selectionColor="#fffff4"
          className="flex-1 text-neutral-400 text-white font-poppins-medium h-full py-0"
          value={query}
          onChangeText={setQuery}
        />
        <X size={16} color="#a8a29e" className="" />
      </View>
    </>
  );
};

export default SearchInput;
