import { useRouter } from "expo-router";
import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { discord } from "@/src/shared/lib/constants/apps/d";
import { App } from "../lib/constants/apps-list";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import * as Haptics from "expo-haptics";

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
      <View className="rounded-full bg-lime-300 px-1.5 py-0.5">
        <Text className="text-lime-900 text-xs font-semibold">New</Text>
      </View>
      <Text className="text-stone-400 text-base flex-1" numberOfLines={1}>
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
      <AnimationItem
        label={getItemProps(discord, 2).label}
        onPress={getItemProps(discord, 2).onPress}
      />
      <AnimationItem
        label={getItemProps(discord, 3).label}
        onPress={getItemProps(discord, 3).onPress}
      />
    </View>
  );
};
