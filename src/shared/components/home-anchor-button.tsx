import { useNavigation } from "expo-router";
import { Home } from "lucide-react-native";
import React, { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { fireHaptic } from "../lib/utils/fire-haptic";
import { useAppStore } from "../lib/store/app";

const SIZE = 44;

export const HomeAnchorButton: FC = () => {
  const navigation = useNavigation();
  const setIsHomeAnchorButtonPressed = useAppStore.use.setIsHomeAnchorButtonPressed();

  return (
    <Animated.View className="absolute inset-0 pointer-events-box-none z-[9999]">
      <Pressable
        className="absolute left-[85%] top-[50%] items-center justify-center rounded-full bg-brand"
        style={styles.container}
        onPress={() => {
          fireHaptic();
          setIsHomeAnchorButtonPressed(true);
          navigation.goBack();
        }}
      >
        <View className="mb-0.5">
          <Home size={20} color="white" fill="white" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderCurve: "continuous",
  },
});
