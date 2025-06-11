import React, { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { CustomSwitch } from "../components/custom-switch";

export const Clips: FC = () => {
  const [value, setValue] = useState(false);

  return (
    <View className="flex-1 bg-[#1C1D24] p-6">
      <View
        className="flex-row items-center gap-4 p-3 bg-[#26272F] rounded-2xl"
        style={styles.borderCurve}
      >
        <View className="flex-1">
          <View className="w-full h-3 rounded-full bg-white/5 mb-2" />
          <View className="w-full h-2 rounded-full bg-white/5 mb-1.5" />
          <View className="w-full h-2 rounded-full bg-white/5 mb-1.5" />
          <View className="w-3/4 h-2 rounded-full bg-white/5" />
        </View>
        {/* discord-custom-switch-animation 🔽 */}
        <CustomSwitch value={value} onValueChange={setValue} />
        {/* discord-custom-switch-animation 🔼 */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
