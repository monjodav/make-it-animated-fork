import { View } from "react-native";

export const HomePost = () => {
  return (
    <View className="w-full px-4 flex-row gap-4">
      <View className="w-12 h-12 rounded-full bg-neutral-900" />
      <View className="flex-1">
        <View className="flex-row items-center gap-4 mb-4">
          <View className="flex-1 gap-2">
            <View className="w-40 h-2 rounded-md bg-neutral-900" />
            <View className="w-32 h-2 rounded-md bg-neutral-900" />
          </View>
        </View>
        <View className="gap-2 mb-4">
          <View className="w-full h-2 rounded-md bg-neutral-900" />
          <View className="w-full h-2 rounded-md bg-neutral-900" />
          <View className="w-full h-2 rounded-md bg-neutral-900" />
          <View className="w-full h-2 rounded-md bg-neutral-900" />
          <View className="w-full h-2 rounded-md bg-neutral-900" />
          <View className="w-full h-2 rounded-md bg-neutral-900" />
          <View className="w-5/6 h-2 rounded-md bg-neutral-900" />
        </View>
      </View>
    </View>
  );
};
