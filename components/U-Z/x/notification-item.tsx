import { View } from "react-native";

export const NotificationItem = () => {
  return (
    <View className="flex-row items-center px-4 gap-4">
      <View className="w-12 h-12 rounded-full bg-x-front" />
      <View className="flex-1 gap-2">
        <View className="w-[70%] h-3 rounded-md bg-x-front" />
        <View className="w-[50%] h-3 rounded-md bg-x-front" />
        <View className="w-[55%] h-3 rounded-md bg-x-front" />
      </View>
    </View>
  );
};
