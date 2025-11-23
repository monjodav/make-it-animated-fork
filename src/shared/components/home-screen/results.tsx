import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useConfigure, useInfiniteHits, useInstantSearch } from "react-instantsearch-core";
import AnimationCard from "./animation-card";
import {
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { ArrowUp } from "lucide-react-native";
import { Animation } from "../../lib/types/app";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { AppText } from "../app-text";
import { MANUAL_ERROR_CAPTURE } from "../../lib/utils/sentry";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  listRef: RefObject<FlashListRef<Animation> | null>;
};

export const Results: FC<Props> = ({ listRef }: Props) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleItemIndices, setVisibleItemIndices] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const { height: screenHeight } = useWindowDimensions();

  const { items, isLastPage, showMore } = useInfiniteHits<Animation>();
  const { refresh, status } = useInstantSearch();

  const loading = status === "loading" || status === "stalled";

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      refresh();
    } catch (error) {
      MANUAL_ERROR_CAPTURE({
        title: "Results screen refresh error",
        error,
      });
    }
  }, [refresh]);

  useEffect(() => {
    if (!loading && refreshing) {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  }, [loading, refreshing]);

  useConfigure({
    hitsPerPage: 6,
    disjunctiveFacets: ["difficulty", "app.title", "components", "technologies"],
    // disjunctiveFacetsRefinements: {
    //   difficulty,
    //   "app.title": apps,
    //   components,
    //   technologies,
    // },
  });

  // Track if showMore is currently being called to prevent multiple simultaneous calls
  const isLoadingMoreRef = useRef<boolean>(false);
  // Track the items length when showMore was called to detect when new items are loaded
  const itemsLengthWhenLoadingRef = useRef<number>(0);

  // Reset loading state when items length changes (indicating new page loaded)
  useEffect(() => {
    if (isLoadingMoreRef.current && items.length > itemsLengthWhenLoadingRef.current) {
      // New items have been loaded, reset the loading flag
      isLoadingMoreRef.current = false;
      itemsLengthWhenLoadingRef.current = items.length;
    }
  }, [items.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > screenHeight);
  };

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Animation>[] }) => {
      // Extract indices from viewable items and create a Set for efficient lookup
      const indices = new Set<number>(
        viewableItems
          .map((item) => item.index)
          .filter((index): index is number => index !== null && index !== undefined)
      );
      setVisibleItemIndices(indices);
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 300,
  };

  return (
    <Animated.View className="flex-1">
      <FlashList
        ref={listRef}
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <AnimationCard animation={item} index={index} visibleItemIndices={visibleItemIndices} />
        )}
        ListFooterComponent={() => {
          if (!isLastPage || items.length === 0) {
            return null;
          }
          return (
            <AppText className="ml-3 text-base text-muted-foreground font-sans-medium">
              {/* VS - change the message if query is applied */}
              Yay! You have seen it all 🎉
            </AppText>
          );
        }}
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={handleViewableItemsChanged}
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#B2ACA9" />
        }
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          // Only call showMore if we're not on the last page and not already loading
          if (!isLastPage && !isLoadingMoreRef.current) {
            isLoadingMoreRef.current = true;
            itemsLengthWhenLoadingRef.current = items.length;
            showMore();
          }
        }}
      />
      {showBackToTop && (
        <AnimatedPressable
          entering={FadeInDown.springify()}
          exiting={FadeOutDown.springify()}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
          className="absolute w-12 h-12 right-6 bottom-4 bg-neutral-700 rounded-full items-center justify-center"
        >
          <ArrowUp size={20} color="#FFFFF5" strokeWidth={2.5} />
        </AnimatedPressable>
      )}
    </Animated.View>
  );
};
