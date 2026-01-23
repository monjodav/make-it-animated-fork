import { StyleSheet, Text } from "react-native";
import SegmentedControl from "@/src/shared/components/segmented-control";

type DurationControlProps = {
  value: "overall" | "today";
  setValue: (value: "overall" | "today") => void;
};

export const DurationControl = ({ value, setValue }: DurationControlProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={(v) => setValue(v as "overall" | "today")}
      className="overflow-hidden mx-4 px-[3px] py-[3px] rounded-full bg-blue-950/70"
      style={styles.borderCurve}
    >
      <SegmentedControl.Indicator
        className="bg-violet-400/30 top-[3px] rounded-full"
        style={styles.borderCurve}
      />

      <SegmentedControl.Item value="overall" className="w-24 py-3 rounded-full">
        <Text className="text-white font-semibold text-center">Overall</Text>
      </SegmentedControl.Item>

      <SegmentedControl.Item value="today" className="w-24 py-3 rounded-full">
        <Text className="text-white font-semibold text-center">Today</Text>
      </SegmentedControl.Item>
    </SegmentedControl>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});