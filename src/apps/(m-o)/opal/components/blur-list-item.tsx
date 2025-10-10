import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { cn } from "@/src/shared/lib/utils/cn";

type BlurListItemProps = {
  count: number;
  borderClass?: string;
  intensity?: number;
};

const BlurListItem = ({
  count,
  borderClass = "border border-neutral-300/30",
  intensity = 8,
}: BlurListItemProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={{ borderCurve: "continuous" }}
          className={cn(
            "h-14 overflow-hidden mb-4 rounded-[10px]",
            borderClass,
            Platform.OS === "android" ? "bg-neutral-500/70" : "bg-neutral-500/30"
          )}
        >
          <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
        </View>
      ))}
    </>
  );
};

export default BlurListItem;
