import { Text, View } from "react-native";
import SegmentedControl from "@/src/shared/components/segment-control/segment-control";
import { cn } from "@/src/shared/lib/utils/cn";

type SwitcherProps = {
  value: string;
  setValue: (value: string) => void;
};

const Switcher = ({ value, setValue }: SwitcherProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue}
      className="bg-[#1A1A1A] mx-5 mb-7 self-center justify-between rounded-[20px]"
    >
      <SegmentedControl.Indicator className="bg-[#1A1A1A] rounded-[20px] border-[4px] border-white" />

      <SegmentedControl.Item value="1" pressScale={0.95} className="flex-1 px-5 py-4 rounded-full">
        {({ isActive }) => (
          <>
            <Text
              className={cn(
                isActive ? "text-[#E0E0E1] text-lg font-bold" : "text-[#616161] text-lg font-bold"
              )}
            >
              SuperGrok
            </Text>
            <View className="flex-row items-end">
              <Text
                className={cn(
                  isActive
                    ? "text-[#E0E0E1] text-2xl font-bold"
                    : "text-[#616161] text-2xl font-bold"
                )}
              >
                40,00 USD
              </Text>
              <Text
                className={cn(
                  isActive ? "text-[#E0E0E1] text-lg font-bold" : "text-[#616161] text-lg font-bold"
                )}
              >
                /mo
              </Text>
            </View>
          </>
        )}
      </SegmentedControl.Item>
      <SegmentedControl.Item value="2" pressScale={0.95} className="flex-1 px-5 py-4 rounded-full">
        {({ isActive }) => (
          <>
            <Text
              className={cn(
                isActive ? "text-[#E0E0E1] text-lg font-bold" : "text-[#616161] text-lg font-bold"
              )}
            >
              SuperGrok Heavy
            </Text>
            <View className="flex-row items-end">
              <Text
                className={cn(
                  isActive
                    ? "text-[#E0E0E1] text-2xl font-bold"
                    : "text-[#616161] text-2xl font-bold"
                )}
              >
                400,00 U...
              </Text>
              <Text
                className={cn(
                  isActive ? "text-[#E0E0E1] text-lg font-bold" : "text-[#616161] text-lg font-bold"
                )}
              >
                /mo
              </Text>
            </View>
          </>
        )}
      </SegmentedControl.Item>
    </SegmentedControl>
  );
};

export default Switcher;
