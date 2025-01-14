import { ChatListItem } from "@/components/viber/chat-list-item";
import { ScreenHeader } from "@/components/viber/screen-header";
import { SearchBar } from "@/components/viber/search-bar";
import { useScrollHandler } from "@gorhom/bottom-sheet";
import { Camera, Plus, SquarePen } from "lucide-react-native";
import React from "react";
import { View, Text, FlatList, Alert } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useScrollViewOffset,
  useSharedValue,
} from "react-native-reanimated";

export default function Chats() {
  const listOffsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { y } }) => {
      listOffsetY.value = y;
    },
  });

  const _renderListHeader = () => {
    return (
      <View>
        <Text className="text-3xl text-neutral-300 font-bold mb-4">Chats</Text>
        <SearchBar />
        <View className="flex-row items-center gap-2 mt-6 ">
          <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900 border border-[#7F61F2]/50">
            <Text className="text-neutral-300 text-sm">All</Text>
          </View>
          <View className="px-4 h-8 items-center justify-center rounded-full bg-neutral-900">
            <Text className="text-neutral-300 text-sm">
              <Text className="text-xs">⭐</Text> Favorites
            </Text>
          </View>
          <View className="w-8 h-8 items-center justify-center rounded-full bg-neutral-900">
            <Plus size={14} color="#7F61F280" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <ScreenHeader
        title="Chats"
        rightIcon1={<Camera size={20} color="#7F61F2" />}
        onRightButton1Press={() => Alert.alert("Take a photo")}
        rightIcon2={<SquarePen size={18} color="#7F61F2" />}
        onRightButton2Press={() => Alert.alert("Create a chat")}
      />
      <Animated.FlatList
        data={Array.from({ length: 20 }, (_, index) => index)}
        renderItem={({ item }) => <ChatListItem key={item} />}
        contentContainerClassName="p-5 gap-4"
        ListHeaderComponent={_renderListHeader}
        indicatorStyle="white"
      />
    </View>
  );
}
