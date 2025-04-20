import { useRouter } from "expo-router";
import React, { FC } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { fuse } from "@/src/shared/lib/constants/apps/f";
import { App } from "../lib/constants/apps-list";

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

export const NewAnimations: FC = () => {
  const router = useRouter();

  const getItemProps = (app: App, animationIndex: number) => {
    if (animationIndex < 0 || animationIndex >= app.animations.length) {
      throw new Error("Invalid animation index");
    }
    return {
      label: app.name + " " + app.animations[animationIndex].name.toLowerCase(),
      onPress: () => router.push(app.animations[animationIndex].href),
    };
  };

  return (
    <View className="px-5 gap-5 py-5">
      <AnimationItem label={getItemProps(fuse, 0).label} onPress={getItemProps(fuse, 0).onPress} />
      <AnimationItem label={getItemProps(fuse, 1).label} onPress={getItemProps(fuse, 1).onPress} />
    </View>
  );
};
