import { View } from "react-native";
import { TabItem } from "./tab-item";
import { TabIndicator } from "./tab-indicator";
import { TabBarProps } from "react-native-collapsible-tab-view";

// threads-home-header-tabs-animation 🔽

const TABS_HORIZONTAL_PADDING = 16;

type Props = TabBarProps<string>;

export function TopTabs({ tabNames, indexDecimal, onTabPress }: Props) {
  return (
    <View>
      <View className="flex-row pb-2" style={{ paddingHorizontal: TABS_HORIZONTAL_PADDING }}>
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
      <TabIndicator
        indexDecimal={indexDecimal}
        numberOfTabs={tabNames.length}
        tabsHorizontalPadding={TABS_HORIZONTAL_PADDING}
      />
    </View>
  );
}

// threads-home-header-tabs-animation 🔼
