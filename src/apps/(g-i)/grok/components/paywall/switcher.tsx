import { Text, View, StyleSheet } from "react-native";
import SegmentedControl from "@/src/shared/components/segmented-control";
import { cn } from "@/src/shared/lib/utils/cn";

// grok-paywall-screen-animation 🔽

// Animation notes:
// - SegmentedControl drives indicator movement/press feedback internally; here we configure the UX:
// - pressScale=0.98: quick tactile feedback without distracting from content
// - Continuous border curves: iOS 16+ rounded geometry avoids sharp edges during indicator motion
// - value/onValueChange: source of truth that triggers indicator transition between segments

type PricingItemProps = {
  isActive: boolean;
  title: string;
  price: string;
  period?: string;
};

const PricingItem = ({ isActive, title, price, period = "/mo" }: PricingItemProps) => {
  return (
    <>
      <Text
        className={cn(
          isActive ? "text-neutral-50 text-lg font-bold" : "text-neutral-400 text-lg font-bold"
        )}
      >
        {title}
      </Text>
      <View className="flex-row items-end">
        <Text
          className={cn(
            isActive ? "text-neutral-50 text-2xl font-bold" : "text-neutral-400 text-2xl font-bold"
          )}
        >
          {price}
        </Text>
        <Text
          className={cn(
            isActive ? "text-neutral-50 text-lg font-bold" : "text-neutral-400 text-lg font-bold"
          )}
        >
          {period}
        </Text>
      </View>
    </>
  );
};

type SwitcherProps = {
  value: string;
  setValue: (value: string) => void;
};

const Switcher = ({ value, setValue }: SwitcherProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue}
      className="bg-neutral-900 mx-5 mb-7 self-center justify-between rounded-[20px]"
      style={styles.borderCurve}
    >
      {/* Indicator: sliding white border */}
      <SegmentedControl.Indicator
        className="bg-neutral-900 rounded-[20px] border-[3.5px] border-white"
        style={styles.borderCurve}
      />

      {/* Item: small pressScale for subtle depth on tap; rounded-full to match indicator path */}
      <SegmentedControl.Item value="1" pressScale={0.98} className="flex-1 px-5 py-4 rounded-full">
        {({ isActive }) => <PricingItem isActive={isActive} title="SuperGrok" price="40,00 USD" />}
      </SegmentedControl.Item>

      <SegmentedControl.Item value="2" pressScale={0.98} className="flex-1 px-5 py-4 rounded-full">
        {({ isActive }) => (
          <PricingItem isActive={isActive} title="SuperGrok Heavy" price="400,00 U..." />
        )}
      </SegmentedControl.Item>
    </SegmentedControl>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    // Continuous curves produce smoother corner morphing when animating on iOS 16+
    borderCurve: "continuous",
  },
});

export default Switcher;

// grok-paywall-screen-animation 🔼
