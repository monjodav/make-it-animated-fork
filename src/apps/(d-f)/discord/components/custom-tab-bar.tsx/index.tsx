import { View, StyleSheet, useWindowDimensions } from "react-native";
import { TabItem } from "./tab-item";
import { TabIndicator } from "./tab-indicator";
import { TabBarProps } from "react-native-collapsible-tab-view";
import { TAB_BAR_HEIGHT } from "../../lib/constants/account";

// discord-top-tabs-indicator-animation 🔽

const TAB_BAR_OUTER_PADDING = 20;

type Props = TabBarProps<string>;

export function CustomTabBar({ tabNames, indexDecimal, onTabPress }: Props) {
  const { width } = useWindowDimensions();

  const indicatorWidth = (width - TAB_BAR_OUTER_PADDING * 2) / tabNames.length;

  return (
    <View style={styles.outerContainer}>
      <View
        className="flex-row bg-[#101217] rounded-full items-center"
        style={styles.innerContainer}
      >
        <TabIndicator indexDecimal={indexDecimal} width={indicatorWidth} />
        {tabNames.map((tab, index) => {
          return (
            <TabItem
              key={tab}
              index={index}
              tabName={tab}
              indexDecimal={indexDecimal}
              onPress={() => {
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
    borderCurve: "continuous",
  },
});

// discord-top-tabs-indicator-animation 🔼
