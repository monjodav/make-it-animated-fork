import { FC } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { AppText } from "../../app-text";
import { App } from "@/src/shared/lib/constants/apps";
import { router } from "expo-router";
import { fireHaptic } from "@/src/shared/lib/utils/fire-haptic";

type HeaderProps = {
  animation: App;
  index: number;
};

export const Header: FC<HeaderProps> = ({ animation, index }) => {
  const handleRedirect = () => {
    fireHaptic();
    router.push(animation.href);
  };
  return (
    <Pressable onPress={handleRedirect} className="flex-row gap-3 items-center mx-2">
      <View
        className="w-[44px] h-[44px] rounded-2xl bg-foreground p-[1.5px] items-center justify-center"
        style={[styles.borderCurve]}
      >
        <Text className="w-full text-center text-4xl font-display">{index + 1}</Text>
      </View>

      <View className="flex-1">
        <AppText numberOfLines={1} className="text-base/5 text-muted-foreground font-sans-medium">
          {animation.appName}
        </AppText>
        <AppText numberOfLines={1} className="text-xl font-sans-medium">
          {animation.animationName}
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
