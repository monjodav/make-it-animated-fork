import { cn } from "@/src/shared/lib/utils/cn";
import React, { FC } from "react";
import { View, Text, Pressable } from "react-native";

type Props = {
  icon: React.ReactNode;
  label: string;
  className?: string;
  iconContainerClassName?: string;
  onPress?: () => void;
};

export const MenuItem: FC<Props> = ({
  icon,
  label,
  className,
  iconContainerClassName,
  onPress,
}) => {
  return (
    <Pressable className={cn("flex-row items-center gap-6", className)} onPress={onPress}>
      <View
        className={cn(
          "w-10 h-10 items-center justify-center rounded-full bg-white",
          iconContainerClassName
        )}
      >
        {icon}
      </View>
      <Text className="text-white text-2xl font-medium">{label}</Text>
    </Pressable>
  );
};
