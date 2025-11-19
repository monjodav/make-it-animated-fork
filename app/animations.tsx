import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Results } from "@/src/shared/components/animations-screen/results";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import SearchInput from "@/src/shared/components/animations-screen/search-input";

export default function Animations() {
  const { top } = useSafeAreaInsets();

  return (
    <AlgoliaProvider>
      <View className="flex-1 bg-black px-4" style={{ paddingTop: top + 12 }}>
        <SearchInput />
        <Results />
      </View>
    </AlgoliaProvider>
  );
}
