import { Text, View, StyleSheet } from "react-native";
import SegmentedControl from "@/src/shared/components/segment-control/segment-control";
import { cn } from "@/src/shared/lib/utils/cn";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";

// opal-schedule-timer-transition-animation 🔽

type SwitcherProps = {
  value: "schedule" | "timer";
  setValue: (value: "schedule" | "timer") => void;
};

const ScheduleTimerControl = ({ value, setValue }: SwitcherProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={(v) => setValue(v as "schedule" | "timer")}
      className="overflow-hidden mx-5 px-[3px] py-[3px] rounded-full"
      style={styles.borderCurve}
    >
      <BlurView intensity={8} tint="systemThickMaterialLight" style={StyleSheet.absoluteFill} />

      <SegmentedControl.Indicator
        className="bg-neutral-400/30 top-[3px] rounded-full"
        style={styles.borderCurve}
      />

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

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

export default ScheduleTimerControl;

// opal-schedule-timer-transition-animation 🔼
