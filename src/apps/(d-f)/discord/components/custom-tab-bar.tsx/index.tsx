import { View, StyleSheet, useWindowDimensions } from "react-native";
import { TabItem } from "./tab-item";
import { TabIndicator } from "./tab-indicator";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { TAB_BAR_HEIGHT } from "../../lib/constants/account";

// discord-top-tabs-indicator-animation 🔽

// Horizontal padding around the entire tab bar - ensures consistent spacing from screen edges
// Used in indicator width calculation to match visual boundaries
const TAB_BAR_OUTER_PADDING = 20;

type Props = TabBarProps<string>;

export function CustomTabBar({ tabNames, indexDecimal, onTabPress }: Props) {
  const { width } = useWindowDimensions();

  // Calculate indicator width to match tab distribution
  // Subtracts outer padding from both sides, then divides by tab count for equal spacing
  const indicatorWidth = (width - TAB_BAR_OUTER_PADDING * 2) / tabNames.length;

  return (
    <View style={styles.outerContainer}>
      <View
        className="flex-row bg-[#101217] rounded-full items-center"
        style={styles.innerContainer}
      >
        {/* Indicator animates beneath tabs - positioned first for proper z-layering */}
        <TabIndicator indexDecimal={indexDecimal} width={indicatorWidth} />
        {tabNames.map((tab, index) => {
          return (
            <TabItem
              key={tab}
              index={index}
              tabName={tab}
              indexDecimal={indexDecimal}
              onPress={() => {
                // Callback triggers external state update that drives indexDecimal animation
                onTabPress(tab);
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: TAB_BAR_OUTER_PADDING,
  },
  innerContainer: {
    height: TAB_BAR_HEIGHT,
    borderCurve: "continuous", // iOS 16+ continuous curves for softer visual appearance
  },
});

// discord-top-tabs-indicator-animation 🔼
