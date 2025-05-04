import { Settings2 } from "lucide-react-native";
import React from "react";
import { Pressable, Alert, View, StyleSheet } from "react-native";
import {
  EDIT_HOME_CONTAINER_WIDTH,
  SETTINGS_CONTAINER_WIDTH,
} from "../../lib/providers/home-animation";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { useHeaderHeight } from "../../lib/hooks/use-header-height";
import { Image } from "expo-image";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CustomHeader = () => {
  const { insetTop, netHeight } = useHeaderHeight();

  return (
    <View style={{ paddingTop: insetTop }}>
      <View className="flex-row items-center justify-center" style={{ height: netHeight }}>
        <AnimatedPressable
          entering={FadeIn}
          onPress={() => Alert.alert("Edit Home")}
          className="items-center justify-center"
          style={{ width: EDIT_HOME_CONTAINER_WIDTH }}
        >
          <Settings2 size={24} color="#e5e5e5" />
        </AnimatedPressable>
        <View className="flex-1" />
        <AnimatedPressable
          entering={ZoomIn}
          onPress={() => Alert.alert("Settings")}
          className="items-center justify-center"
          style={styles.imageContainer}
        >
          <Image placeholder={{ blurhash: "LKO2:N%2Tw=w]~RBVZRi};RPxuwH" }} style={styles.image} />
        </AnimatedPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: SETTINGS_CONTAINER_WIDTH,
  },
  image: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
  },
});
