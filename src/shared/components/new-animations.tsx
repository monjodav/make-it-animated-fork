import { useRouter } from "expo-router";
import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { App } from "../lib/constants/apps-list";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import * as Haptics from "expo-haptics";
import { grok } from "../lib/constants/apps/g";
import { raycast } from "../lib/constants/apps/r";
import { opal } from "../lib/constants/apps/o";

type AnimationItemProps = {
  label: string;
  onPress: () => void;
};

const AnimationItem = ({ label, onPress }: AnimationItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className="flex-row items-center gap-2"
    >
      <Text className="text-brand text-sm font-poppins-medium">New</Text>
      <Text className="text-neutral-400 text-sm flex-1 font-poppins-medium" numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

type Props = { navigation: DrawerContentComponentProps["navigation"] };

export const NewAnimations: FC<Props> = ({ navigation }) => {
  const router = useRouter();

  const getItemProps = (app: App, animationIndex: number) => {
    if (animationIndex < 0 || animationIndex >= app.animations.length) {
      throw new Error("Invalid animation index");
    }
    return {
      label: app.name + " " + app.animations[animationIndex].name.toLowerCase(),
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(app.animations[animationIndex].href);
        navigation.closeDrawer();
      },
    };
  };

  return (
    <View className="px-5 gap-5 py-5">
      <AnimationItem label={getItemProps(opal, 2).label} onPress={getItemProps(opal, 2).onPress} />
      <AnimationItem
        label={getItemProps(raycast, 1).label}
        onPress={getItemProps(raycast, 1).onPress}
      />
      <AnimationItem label={getItemProps(grok, 2).label} onPress={getItemProps(grok, 2).onPress} />
    </View>
  );
};
