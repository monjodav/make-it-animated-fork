import { View } from "react-native";
import { Results } from "@/src/shared/components/animations-screen/results";
import { AlgoliaProvider } from "@/src/shared/lib/providers/algolia-provider";
import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomBar } from "@/src/shared/components/animations-screen/bottom-bar";

export default function Animations() {
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <AlgoliaProvider>
      <View className="flex-1">
        <Results sheetRef={sheetRef} />
        <BottomBar />
      </View>
    </AlgoliaProvider>
  );
}
