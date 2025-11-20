import { FC, useRef, useState } from "react";
import { useHits } from "react-instantsearch-core";
import AnimationCard from "./animation-card";
import { LegendList } from "@legendapp/list";
import { AlgoliaRawResult, AnimationHit } from "../../lib/types/algolia-search";
import SearchInput from "./search-input";
import {
  View,
  Pressable,
  Text,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Switcher from "./switcher";
import Filters from "./filters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowUp } from "lucide-react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type ResultsProps = {
  sheetRef: any;
  handleFilterSelect: any;
  selectedFilters: any;
  handleRemoveItem: any;
  handleClearAll: any;
};

export const Results: FC<ResultsProps> = ({
  sheetRef,
  handleFilterSelect,
  selectedFilters,
  handleRemoveItem,
  handleClearAll,
}) => {
  const { top, bottom } = useSafeAreaInsets();
  const { results } = useHits<AlgoliaRawResult>();
  const hits = results?.hits as AnimationHit[] | undefined;
  const listRef = useRef<any>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > SCREEN_HEIGHT * 1.5);
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={{ flex: 1 }}>
      <LegendList
        ref={listRef}
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
        contentContainerClassName="px-4 pb-8 bg-black"
      />

      {showBackToTop && (
        <Pressable
          onPress={scrollToTop}
          className="absolute w-[50px] h-[50px] right-3 bg-white rounded-full items-center justify-center shadow-[0_4_8_#1C1C1C80] elevation-8"
          style={{ bottom }}
        >
          <ArrowUp size={24} color="#000" strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
};
