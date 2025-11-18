import { Results } from "@/src/shared/components/animations-screen/results";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { View } from "react-native";

export default function Animations() {
  return (
    <AlgoliaProvider>
      <View className="flex-1 bg-black">
        <Results />
      </View>
    </AlgoliaProvider>
  );
}
