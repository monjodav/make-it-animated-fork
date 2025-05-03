import { Settings2 } from "lucide-react-native";
import React from "react";
import { Pressable, Alert, View } from "react-native";
import { EDIT_HOME_CONTAINER_WIDTH, useHomeAnimation } from "../../lib/providers/home-animation";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useHeaderHeight } from "../../lib/hooks/use-header-height";
import { SettingsButton } from "./settings-button";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CustomHeader = () => {
  const { insetTop, netHeight } = useHeaderHeight();

  const { screenView } = useHomeAnimation();

  return (
    <View className="absolute top-0 left-0 right-0" style={{ paddingTop: insetTop }}>
      <View className="flex-row items-center justify-center" style={{ height: netHeight }}>
        {screenView === "favorites" && (
          <AnimatedPressable
            entering={FadeIn}
            exiting={FadeOut}
            onPress={() => Alert.alert("Edit Home")}
            className="items-center justify-center"
            style={{ width: EDIT_HOME_CONTAINER_WIDTH }}
          >
            <Settings2 size={24} color="#e5e5e5" />
          </AnimatedPressable>
        )}
        <View className="flex-1" />
        {screenView === "favorites" && <SettingsButton />}
      </View>
    </View>
  );
};
