import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export const Details = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <Pressable onPress={() => router.back()}>
        <Text className="text-white">Close</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({});
