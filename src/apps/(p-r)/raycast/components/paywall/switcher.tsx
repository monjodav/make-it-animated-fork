import { Text, View, StyleSheet, Platform } from "react-native";
import SegmentedControl from "@/src/shared/components/segment-control/segment-control";
import { cn } from "@/src/shared/lib/utils/cn";
import { BlurView } from "expo-blur";

type SwitcherProps = {
  value: "monthly" | "yearly";
  setValue: (value: "monthly" | "yearly") => void;
};

const Switcher = ({ value, setValue }: SwitcherProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={(v) => setValue(v as "monthly" | "yearly")}
      className={cn(
        "overflow-hidden mb-5 px-1 py-1 justify-between rounded-full",
        Platform.OS === "android" ? "bg-neutral-700" : "bg-neutral-700/50"
      )}
    >
      <BlurView tint="dark" style={StyleSheet.absoluteFill} />
      <SegmentedControl.Indicator className="bg-[#7B7B7B] my-1 rounded-full" />

      <SegmentedControl.Item value="monthly" className="px-4 py-1 rounded-full">
        {({ isActive }) => (
          <Text
            className={cn(
              isActive
                ? "text-[#E0E0E1] text-lg font-semibold"
                : "text-[#92888A] text-lg font-semibold"
            )}
          >
            Monthly
          </Text>
        )}
      </SegmentedControl.Item>
      <SegmentedControl.Item value="yearly" className="pl-4 pr-1 py-1 rounded-full">
        {({ isActive }) => (
          <View className="flex-row gap-3">
            <Text
              className={cn(
                isActive
                  ? "text-[#E0E0E1] text-lg font-semibold"
                  : "text-[#92888A] text-lg font-semibold"
              )}
            >
              Yearly
            </Text>
            <Text
              className={"text-[#616161] text-base font-semibold pt-0.5 px-2 bg-white rounded-full"}
            >
              -20%
            </Text>
          </View>
        )}
      </SegmentedControl.Item>
    </SegmentedControl>
  );
};

export default Switcher;
