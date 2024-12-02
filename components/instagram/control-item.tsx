import { cn } from "@/utils/cn";
import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { Position } from "./controls";

type Props = {
  controlsPosition: Position;
  icon: React.ReactNode;
  label: React.ReactNode;
};

export const ControlItem: FC<Props> = ({ controlsPosition, icon, label }) => {
  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-4",
        controlsPosition === "right" && "flex-row-reverse"
      )}
    >
      <View className="w-8">{icon}</View>
      {label}
    </Pressable>
  );
};
