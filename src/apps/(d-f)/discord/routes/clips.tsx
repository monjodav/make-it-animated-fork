import React, { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { CustomSwitch } from "../components/custom-switch";
import { useIOSNote } from "@/src/shared/lib/hooks/use-ios-note";

export const Clips: FC = () => {
  useIOSNote(
    "On iOS 26 there is a known issue with the header layout. The fix is ready and the app is awaiting review to release a new version. Sorry for the inconvenience."
  );

  const [value, setValue] = useState(false);

  return (
    <View className="flex-1 bg-[#1C1D24] p-6">
      <View
        className="flex-row items-center gap-4 p-3 bg-[#26272F] rounded-2xl"
        style={styles.borderCurve}
      >
        <View className="flex-1">
          <View className="w-3/4 h-3 rounded-full bg-white/5 mb-3" />
          <View className="w-full h-2 rounded-full bg-white/5 mb-1.5" />
          <View className="w-full h-2 rounded-full bg-white/5 mb-1.5" />
          <View className="w-1/2 h-2 rounded-full bg-white/5" />
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
