import { TextInput, View } from "react-native";
import { Results } from "@/src/shared/components/animations-screen/results";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { BottomBar } from "@/src/shared/components/animations-screen/bottom-bar";
import { SearchBar } from "@/src/shared/components/animations-screen/search-bar";
import { useRef } from "react";

export default function Animations() {
  const textInputRef = useRef<TextInput>(null);

  return (
    <AlgoliaProvider>
      <View className="flex-1">
        <Results />
        <BottomBar textInputRef={textInputRef} />
        <SearchBar textInputRef={textInputRef} />
      </View>
    </AlgoliaProvider>
  );
}
