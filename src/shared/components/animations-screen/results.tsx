import { FC } from "react";
import { useHits } from "react-instantsearch-core";
import AnimationCard from "./animation-card";
import { LegendList } from "@legendapp/list";
import { AlgoliaRawResult, AnimationHit } from "../../lib/types/algolia-search";
import SearchInput from "./search-input";
import { View } from "react-native";
import Switcher from "./switcher";
import Filters from "./filters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Results: FC = ({
  sheetRef,
  handleFilterSelect,
  selectedFilters,
  handleRemoveItem,
  handleClearAll,
}) => {
  const { top } = useSafeAreaInsets();
  const { results } = useHits<AlgoliaRawResult>();
  const hits = results?.hits as AnimationHit[] | undefined;
  // console.log(">>", JSON.stringify(results, null, 2));
  return (
    <LegendList
      data={hits ?? []}
      renderItem={({ item }) => (
        <AnimationCard
          playback_id={item.video.dev.playback_id}
          appTitle={item.app.title}
          animationTitle={item.title}
          logoUrl={item.app.icon_url}
          createdAt={item._creationTime}
        />
      )}
      keyExtractor={(item) => item._id}
      recycleItems
      maintainVisibleContentPosition
      ListHeaderComponent={() => {
        return (
          <View style={{ paddingTop: top + 12 }}>
            <SearchInput />
            <View className="h-6" />
            <Filters
              sheetRef={sheetRef}
              onFilterSelect={handleFilterSelect}
              selectedFilters={selectedFilters}
              onRemoveItem={handleRemoveItem}
              onClearAll={handleClearAll}
            />
            <Switcher />
          </View>
        );
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 32,
        backgroundColor: "black",
      }}
    />
  );
};
