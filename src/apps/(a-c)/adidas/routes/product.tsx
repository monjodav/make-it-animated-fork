import { Image, useWindowDimensions, View, Text, ViewToken, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Heart, MoveRight, Upload } from "lucide-react-native";
import { LegendList, LegendListRef } from "@legendapp/list";
import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "../components/product/pagination";
import { INITIAL_DATA, ProductItem, generateNewItems } from "../lib/data/data";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { useSharedValue } from "react-native-reanimated";

const Product = () => {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const listHeight = screenHeight * 0.6;

  const listRef = useRef<LegendListRef>(null);

  useEffect(() => {
    setTimeout(() => {
      loadMoreAtStart();
    }, 50);
  }, []);

  const [data, setData] = useState([...INITIAL_DATA]);

  const loadMoreAtEnd = useCallback(() => {
    const newItems = generateNewItems();
    setData((prev) => [...prev, ...newItems]);
  }, []);

  const loadMoreAtStart = useCallback(() => {
    const newItems = generateNewItems();
    setData((prev) => [...newItems, ...prev]);
  }, []);

  const currentSlideIndex = useSharedValue(0);
  const [currentItem, setCurrentItem] = useState<(ProductItem & { index: number }) | null>(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const viewableItem = viewableItems[0];
      if (viewableItem && viewableItem.index !== null) {
        currentSlideIndex.set(viewableItem.item.index);
        setCurrentItem(viewableItem.item);
      }
    }
  }).current;

  const onMomentumScrollEnd = () => {
    const targetIndex = data.findIndex((item) => item.id === currentItem?.id);
    if (targetIndex !== -1 && listRef.current) {
      listRef.current.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  return (
    <View className="flex-1">
      <View className="bg-white z-50" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 py-2 border-b border-neutral-200 bg-white">
          <ArrowLeft size={20} color="black" strokeWidth={1} />

          <View className="flex-row items-center gap-5">
            <Upload size={20} color="black" strokeWidth={1} />
            <Heart size={20} color="black" strokeWidth={1} />
          </View>
        </View>
      </View>
      <View style={{ height: listHeight }}>
        <LegendList
          ref={listRef}
          data={data}
          renderItem={({ item }) => {
            return (
              <View
                className="w-full"
                style={{
                  height: listHeight,
                  width: screenWidth,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="cover"
                  style={{ height: listHeight, width: screenWidth }}
                  source={{ uri: item.imageUrl }}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreAtEnd}
          onStartReached={loadMoreAtStart}
          onEndReachedThreshold={0.5}
          onStartReachedThreshold={0.5}
          snapToInterval={listHeight}
          decelerationRate="normal"
          recycleItems
          showsVerticalScrollIndicator={false}
          contentContainerClassName="bg-[#EAEFF0] items-center"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
        <Pagination initialData={INITIAL_DATA} currentSlideIndex={currentSlideIndex} />
      </View>
      <View className="flex-1 w-full bg-white">
        <Text className="text-xl font-semibold px-4 pt-6">SNEAKERS TRAIL RUNNING</Text>
        <Text className="px-4 pb-6">2 999</Text>
        <View className="border-b border-neutral-200 bg-white" />
        <Pressable
          className="flex-row justify-between items-center p-4 mx-4 bg-black mt-4"
          onPress={simulatePress}
        >
          <Text className="text-white font-semibold">CHOOSE SIZE</Text>
          <MoveRight size={20} color="white" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
};

export default Product;
