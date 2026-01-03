import {
  Image,
  useWindowDimensions,
  View,
  Text,
  ViewToken,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Heart, MoveRight, Upload } from "lucide-react-native";
import { LegendList, LegendListRef } from "@legendapp/list";
import { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "../components/product/pagination";
import { INITIAL_DATA, ProductItem, generateNewItems } from "../lib/data/data";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { useSharedValue } from "react-native-reanimated";

const Divider = () => {
  return <View className="bg-neutral-400" style={{ height: StyleSheet.hairlineWidth }} />;
};

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
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <ArrowLeft size={20} color="black" strokeWidth={1} />
        <View className="flex-row items-center gap-5">
          <Upload size={20} color="black" strokeWidth={1} />
          <Heart size={20} color="black" strokeWidth={1} />
        </View>
      </View>
      <Divider />
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
          contentContainerClassName="items-center"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
        <Pagination initialData={INITIAL_DATA} currentSlideIndex={currentSlideIndex} />
      </View>
      <View className="flex-1 pt-6 px-4">
        <Text className="text-xl font-semibold mb-2">SNEAKERS TRAIL RUNNING</Text>
        <View className="flex-row items-center pb-6 gap-2">
          <Text className="text-red-700 font-bold text-base">49$</Text>
          <Text className="text-black line-through text-base">59$</Text>
          <View className="bg-red-700 px-2 py-0.5">
            <Text className="text-white text-base">- 17 %</Text>
          </View>
          <Text className="text-black text-sm tracking-wider font-light">Performance</Text>
        </View>
        <Divider />
        <Pressable
          className="flex-row justify-between items-center p-4 bg-black mt-4"
          onPress={simulatePress}
        >
          <Text className="text-white font-semibold">CHOOSE SIZE</Text>
          <MoveRight size={24} color="white" strokeWidth={1.5} />
        </Pressable>
      </View>
    </View>
  );
};

export default Product;
