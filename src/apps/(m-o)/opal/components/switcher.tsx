import { Text, View, StyleSheet, Platform } from "react-native";
import SegmentedControl from "@/src/shared/components/segment-control/segment-control";
import { cn } from "@/src/shared/lib/utils/cn";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";

type SwitcherProps = {
  value: "schedule" | "timer";
  setValue: (value: "schedule" | "timer") => void;
};

const Switcher = ({ value, setValue }: SwitcherProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={(v) => setValue(v as "schedule" | "timer")}
      className={cn(
        "overflow-hidden mx-5 px-1 py-1 rounded-full",
        Platform.OS === "android" ? "bg-neutral-500/70" : "bg-neutral-500/30"
      )}
    >
      <BlurView intensity={8} tint="dark" style={StyleSheet.absoluteFill} />
      <SegmentedControl.Indicator className="bg-neutral-500 my-1 rounded-full" />

      <SegmentedControl.Item value="schedule" className="flex-1 py-2 px-4 rounded-full">
        {({ isActive }) => (
          <View className="flex-row gap-2 items-center justify-center">
            <Ionicons name="calendar-outline" size={14} color={isActive ? "white" : "grey"} />
            <Text
              className={cn(
                isActive ? "text-white font-semibold" : "text-neutral-400 font-semibold",
                "text-center"
              )}
            >
              Schedule
            </Text>
          </View>
        )}
      </SegmentedControl.Item>
      <SegmentedControl.Item value="timer" className="flex-1 py-2 px-4 rounded-full">
        {({ isActive }) => (
          <View className="flex-row gap-2 items-center justify-center">
            <Ionicons name="play" size={15} color={isActive ? "white" : "grey"} />
            <Text
              className={cn(
                isActive ? "text-white font-semibold" : "text-neutral-400 font-semibold",
                "text-center"
              )}
            >
              Timer
            </Text>
          </View>
        )}
      </SegmentedControl.Item>
    </SegmentedControl>
  );
};

export default Switcher;
