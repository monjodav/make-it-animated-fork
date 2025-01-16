import { ScreenHeader } from "@/components/viber/screen-header";
import { SearchBar } from "@/components/viber/search-bar";
import React from "react";
import { View, Alert } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CallsListItem } from "@/components/viber/calls-list-item";
import { Title } from "@/components/viber/title";

const _titleHeight = 36;

export default function Calls() {
  const listOffsetY = useSharedValue(0);
  const isHeaderTitleVisible = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      listOffsetY.value = y;

      const scrollDistance = _titleHeight;

      if (y > scrollDistance && !isHeaderTitleVisible.value) {
        isHeaderTitleVisible.value = true;
      } else if (y < scrollDistance && isHeaderTitleVisible.value) {
        isHeaderTitleVisible.value = false;
      }
    },
  });

  const rListStyle = useAnimatedStyle(() => {
    return {
      paddingTop: interpolate(
        listOffsetY.value,
        [0, _titleHeight],
        [0, _titleHeight],
        Extrapolation.CLAMP
      ),
    };
  });

  const rTitleStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        listOffsetY.value,
        [0, _titleHeight],
        [_titleHeight, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View className="flex-1 bg-black">
      <ScreenHeader
        title="Calls"
        rightIcon1={<FontAwesome6 name="user-plus" size={18} color="#7F61F2" />}
        onRightButton1Press={() => Alert.alert("Add contact")}
        rightIcon2={<Ionicons name="keypad" size={18} color="#7F61F2" />}
        onRightButton2Press={() => Alert.alert("Open keypad")}
        isHeaderTitleVisible={isHeaderTitleVisible}
      />

      <Animated.View className="px-5 pb-4">
        <View className="mb-4">
          <Title listOffsetY={listOffsetY} inputRange={[0, _titleHeight]} />
        </View>
        <SearchBar />
        <View className="h-px bg-neutral-800/75 -mx-5 mt-6 mb-2" />
        <View className="h-[75px] bg-neutral-900 rounded-2xl" />
      </Animated.View>
      <Animated.FlatList
        data={Array.from({ length: 20 }, (_, index) => index)}
        renderItem={({ item }) => <CallsListItem key={item} />}
        ListHeaderComponent={() => <View className="h-[75px] bg-neutral-900 rounded-2xl" />}
        contentContainerClassName="gap-4 px-5"
        style={rListStyle}
        indicatorStyle="white"
        scrollEventThrottle={1000 / 60}
        onScroll={scrollHandler}
      />
    </View>
  );
}
