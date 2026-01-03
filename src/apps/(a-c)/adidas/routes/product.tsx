import { useCallback, useRef, useState } from "react";
import { Pressable, Text, useWindowDimensions, View, ViewToken } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList, LegendListRef } from "@legendapp/list";
import { ArrowLeft, Heart, MoveRight, Upload } from "lucide-react-native";
import { useSharedValue } from "react-native-reanimated";
import Pagination from "../components/product/pagination";
import Divider from "../components/product/divider";
import ProductImage from "../components/product/product-image";
import { DEFAULT_PRODUCT_ITEMS, generateNewProductItems } from "../lib/data/product-items";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import type { ProductItem } from "../lib/data/product-items";

// adidas-product-infinite-carousel-animation 🔽

const getInitialProductItems = () => {
  const newProductItems = generateNewProductItems();
  return DEFAULT_PRODUCT_ITEMS.concat(newProductItems);
};

const Product = () => {
  const [productItems, setProductItems] = useState(getInitialProductItems());
  const [currentProductItem, setCurrentProductItem] = useState<
    (ProductItem & { index: number }) | null
  >(null);

  const currentSlideIndex = useSharedValue(0);

  const safeAreaInsets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const productListHeight = screenHeight * 0.6;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  const productListRef = useRef<LegendListRef>(null);

  const loadMoreAtStart = useCallback(() => {
    const newProductItems = generateNewProductItems();
    setProductItems((prev) => newProductItems.concat(prev));
  }, []);

  const loadMoreAtEnd = useCallback(() => {
    const newProductItems = generateNewProductItems();
    setProductItems((prev) => prev.concat(newProductItems));
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const firstViewableItem = viewableItems[0];
      if (firstViewableItem && firstViewableItem.index !== null) {
        currentSlideIndex.set(firstViewableItem.item.index);
        setCurrentProductItem(firstViewableItem.item);
      }
    }
  }).current;

  const onMomentumScrollEnd = useCallback(() => {
    const targetProductIndex = productItems.findIndex((item) => item.id === currentProductItem?.id);
    if (targetProductIndex !== -1 && productListRef.current) {
      productListRef.current.scrollToIndex({
        index: targetProductIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [productItems, currentProductItem]);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: safeAreaInsets.top }}>
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <ArrowLeft size={20} color="black" strokeWidth={1} />
        <View className="flex-row items-center gap-5">
          <Upload size={20} color="black" strokeWidth={1} />
          <Heart size={20} color="black" strokeWidth={1} />
        </View>
      </View>
      <Divider />
      <View style={{ height: productListHeight }}>
        <LegendList
          ref={productListRef}
          data={productItems}
          renderItem={({ item }) => {
            return (
              <ProductImage
                imageUrl={item.imageUrl}
                height={productListHeight}
                width={screenWidth}
              />
            );
          }}
          estimatedItemSize={productListHeight}
          initialScrollIndex={DEFAULT_PRODUCT_ITEMS.length}
          keyExtractor={(item) => item.id.toString()}
          onStartReached={loadMoreAtStart}
          onStartReachedThreshold={0.5}
          onEndReached={loadMoreAtEnd}
          onEndReachedThreshold={0.5}
          recycleItems
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
        <Pagination productItems={DEFAULT_PRODUCT_ITEMS} currentSlideIndex={currentSlideIndex} />
      </View>
      <View className="flex-1 pt-6 px-4">
        <Text className="text-xl font-semibold mb-1">SNEAKERS TRAIL RUNNING</Text>
        <View className="flex-row items-center pb-6 gap-2">
          <Text className="text-red-700 font-bold text-base">49$</Text>
          <Text className="text-black line-through text-base">59$</Text>
          <View className="bg-red-700 px-2 py-0.5">
            <Text className="text-white text-base">- 17 %</Text>
          </View>
          <Text className="text-black text-sm tracking-wider font-light">Performance</Text>
        </View>
        <Divider className="-mx-4" />
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

// adidas-product-infinite-carousel-animation 🔼
