import { Text, View, StyleSheet } from "react-native";
import SegmentedControl from "@/src/shared/components/segmented-control";
import { cn } from "@/src/shared/lib/utils/cn";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { FC, PropsWithChildren } from "react";

const MIN_SCALE = 0.98;
const DURATION = 150;

// grok-paywall-screen-animation 🔽

// Animation notes:
// - SegmentedControl drives indicator movement/press feedback internally; here we configure the UX:
// - pressScale=0.98: quick tactile feedback without distracting from content
// - Continuous border curves: iOS 16+ rounded geometry avoids sharp edges during indicator motion
// - value/onValueChange: source of truth that triggers indicator transition between segments

type ItemContainerProps = {
  value: "standard" | "heavy";
};

const ItemContainer: FC<PropsWithChildren<ItemContainerProps>> = ({ children, value }) => {
  const itemScale = useSharedValue(1);

  const onPressIn = () => itemScale.set(withTiming(MIN_SCALE, { duration: DURATION }));
  const onPressOut = () => itemScale.set(withTiming(1, { duration: DURATION }));

  return (
    <SegmentedControl.Item
      value={value}
      className="flex-1 px-5 py-4 rounded-full"
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ transform: [{ scale: itemScale }] }}
    >
      {children}
    </SegmentedControl.Item>
  );
};

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
          isActive ? "text-neutral-50 text-base font-bold" : "text-neutral-400 text-base font-bold"
        )}
      >
        {title}
      </Text>
      <View className="flex-row items-end">
        <Text
          className={cn(
            isActive ? "text-neutral-50 text-xl font-bold" : "text-neutral-400 text-xl font-bold"
          )}
        >
          {price}
        </Text>
        <Text
          className={cn(
            isActive
              ? "text-neutral-50 text-base font-bold"
              : "text-neutral-400 text-base font-bold"
          )}
        >
          {period}
        </Text>
      </View>
    </>
  );
};

type PlanControlProps = {
  value: "standard" | "heavy";
  setValue: (value: "standard" | "heavy") => void;
};

const PlanControl = ({ value, setValue }: PlanControlProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={setValue as (value: string) => void}
      className="bg-neutral-900 mx-5 mb-7 self-center justify-between rounded-[20px]"
      style={styles.borderCurve}
    >
      {/* Indicator: sliding white border */}
      <SegmentedControl.Indicator
        className="bg-neutral-900 rounded-[20px] border-[3.5px] border-white"
        style={styles.borderCurve}
      />

      {/* Item: small pressScale for subtle depth on tap; rounded-full to match indicator path */}
      <ItemContainer value="standard">
        <PricingItem isActive={value === "standard"} title="SuperGrok" price="40,00 USD" />
      </ItemContainer>

      <ItemContainer value="heavy">
        <PricingItem isActive={value === "heavy"} title="SuperGrok Heavy" price="400,00 U..." />
      </ItemContainer>
    </SegmentedControl>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    // Continuous curves produce smoother corner morphing when animating on iOS 16+
    borderCurve: "continuous",
  },
});

export default PlanControl;

// grok-paywall-screen-animation 🔼
