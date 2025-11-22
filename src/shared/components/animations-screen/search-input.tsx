import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { Search, X } from "lucide-react-native";
import { useAnimationsStore } from "../../lib/store/animations";

const HEIGHT = 48;

const SearchInput = () => {
  const query = useAnimationsStore((state) => state.query);
  const setQuery = useAnimationsStore((state) => state.setQuery);
  const clearQuery = useAnimationsStore((state) => state.clearQuery);

  return (
    <>
      <View
        className="flex-row items-center gap-2 rounded-2xl px-3 mb-1 overflow-hidden"
        style={{
          height: HEIGHT,
          backgroundColor: Platform.OS === "ios" ? "#515151" : "#1C1C1C",
          borderWidth: Platform.OS === "ios" ? 0 : 1,
          borderColor: Platform.OS === "ios" ? "transparent" : "#303030",
          borderCurve: "continuous",
        }}
      >
        {Platform.OS === "ios" ? (
          <>
            <View className="absolute h-full left-0.5 right-0.5 top-1 bg-[#1C1C1C] rounded-2xl shadow-[-4_-3_3_#1C1C1C]" />
            <View className="absolute h-full left-0.5 right-0.5 top-1 bg-[#1C1C1C] rounded-2xl shadow-[4_-3_3_#1C1C1C]" />
          </>
        ) : null}
        <Search size={16} color="#a8a29e" className="self-center mr-2" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Animation..."
          placeholderTextColor="#a8a29e"
          selectionColor="#fffff4"
          className="flex-1 text-foreground font-sans-medium h-full py-0"
        />
        {query.length > 0 && (
          <Pressable onPress={clearQuery}>
            <X size={16} color="#a8a29e" />
          </Pressable>
        )}
      </View>
    </>
  );
};

export default SearchInput;
