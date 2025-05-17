import { DrawerActions } from "@react-navigation/native";
import { useNavigation, usePathname } from "expo-router";
import { AlignLeft } from "lucide-react-native";
import React, { FC, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useSharedValue, withSequence, withTiming } from "react-native-reanimated";

export const DrawerToggleButton: FC = () => {
  const navigation = useNavigation();
  const pathname = usePathname();

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0.1, { duration: 600 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Animated.View
      className="absolute top-0 bottom-0 left-0 justify-center pl-3 pointer-events-box-none"
      style={{ opacity }}
    >
      <Pressable
        className="w-10 h-10 items-center justify-center rounded-xl bg-[#131316]"
        style={styles.borderCurve}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
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
