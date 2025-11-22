import { useRouter } from "expo-router";
import { AlignLeft } from "lucide-react-native";
import React, { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export const DrawerToggleButton: FC = () => {
  const router = useRouter();

  const opacity = useSharedValue(0);

  return (
    <Animated.View
      className="absolute top-0 bottom-0 left-0 justify-center pl-3 pointer-events-box-none z-[9999]"
      // style={{ opacity }}
    >
      <Pressable
        className="size-10 items-center justify-center rounded-xl bg-brand"
        style={styles.borderCurve}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/animations");
        }}
      >
        <AlignLeft size={20} color="white" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
