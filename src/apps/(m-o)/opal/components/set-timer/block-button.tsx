import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

const BlockButton = () => {
  return (
    <Pressable
      onPress={simulatePress}
      style={styles.container}
      className="flex-1 flex-row gap-4 justify-center border border-neutral-700 rounded-full overflow-hidden py-2.5"
    >
      {Platform.OS === "ios" && (
        <BlurView style={StyleSheet.absoluteFillObject} tint="systemUltraThinMaterialLight" />
      )}
      <Text className="text-white text-lg self-center">Block</Text>
      <View className="bg-white rounded-md flex-row gap-1 px-1 py-3 items-center justify-center self-center">
        <View className="w-1 h-1 rounded-full bg-neutral-900" />
        <View className="w-1 h-1 rounded-full bg-neutral-900" />
        <View className="w-1 h-1 rounded-full bg-neutral-900" />
      </View>
    </Pressable>
  );
};

export default BlockButton;

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});
