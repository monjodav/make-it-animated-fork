import { View } from "react-native";

export default function Video() {
  return (
    <View className="flex-1 bg-linkedin-back justify-end pb-8">
      <View className="flex-row gap-8 px-4">
        <View className="flex-1 justify-end">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-12 h-12 rounded-full bg-linkedin-front" />
            <View className="flex-1 gap-2">
              <View className="w-40 h-3 rounded-md bg-linkedin-front" />
              <View className="w-32 h-3 rounded-md bg-linkedin-front" />
            </View>
          </View>
          <View className="gap-2">
            <View className="w-full h-3 rounded-md bg-linkedin-front" />
            <View className="w-5/6 h-3 rounded-md bg-linkedin-front" />
          </View>
        </View>
        <View className="gap-6 items-center">
          {Array.from({ length: 2 }).map((_, index) => (
            <View className="gap-2 items-center" key={index}>
              <View className="w-4 h-4 rounded-md bg-linkedin-front" />
              <View className="w-8 h-2 rounded-full bg-linkedin-front" />
            </View>
          ))}
          {Array.from({ length: 2 }).map((_, index) => (
            <View className="w-4 h-4 rounded-md bg-linkedin-front" key={index} />
          ))}
        </View>
      </View>
    </View>
  );
}
