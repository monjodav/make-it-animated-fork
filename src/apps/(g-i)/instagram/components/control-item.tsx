import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { Position } from "./controls";
import { cn } from "@/src/shared/lib/utils/cn";

// instagram-story-controls-animation 🔽

// Fixed height ensures consistent spacing for stacked animation transforms
// Used by parent Controls component for translateY calculations (±_height/2)
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
        // Dynamic layout: left = icon→label, right = label←icon for thumb accessibility
        controlsPosition === "right" && "flex-row-reverse"
      )}
      style={{ height: _height }} // Explicit height prevents layout shifts during animations
      onPress={onPress}
    >
      {/* Fixed 32px icon container ensures consistent alignment across different icon sizes */}
      <View className="w-8 items-center justify-center">{icon}</View>
      {label}
    </Pressable>
  );
};

// instagram-story-controls-animation 🔼
