import { cn } from "@/utils/cn";
import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { Position } from "./controls";

// instagram-story-controls-animation 🔽

export const _height = 40;

type Props = {
  controlsPosition: Position;
  icon: React.ReactNode;
  label: React.ReactNode;
  onPress?: () => void;
};

export const ControlItem: FC<Props> = ({ controlsPosition, icon, label, onPress }) => {
  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-4",
        controlsPosition === "right" && "flex-row-reverse"
      )}
      style={{ height: _height }}
      onPress={onPress}
    >
      <View className="w-8 items-center justify-center">{icon}</View>
      {label}
    </Pressable>
  );
};

// instagram-story-controls-animation 🔼
